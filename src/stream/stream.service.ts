import { BadRequestException, Injectable } from "@nestjs/common";

type StreamType = "m3u8" | "mp4" | "embed";

@Injectable()
export class StreamService {
  private buildHeaders() {
    const apiBase = process.env.API_BASE_URL || process.env.FRONTEND_URL || "";
    return {
      Referer: apiBase ? `${apiBase.replace(/\/$/, "")}/` : "",
      Origin: apiBase ? apiBase.replace(/\/$/, "") : "",
      "User-Agent":
        "Mozilla/5.0 (Android 13; Mobile) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
    } as Record<string, string>;
  }

  private absolutize(url?: string) {
    const storageBase = process.env.STORAGE_URL || "";
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    if (!storageBase) return url;
    return `${storageBase.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }

  private resolveRelative(baseUrl: string, path: string) {
    try {
      return new URL(path, baseUrl).toString();
    } catch {
      return path;
    }
  }

  private parseAttributes(line: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const regex = /(\w+)=(("[^"]*")|([^,]*))(?:,|$)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(line))) {
      const key = m[1];
      let val = m[3] || m[4] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      attrs[key] = val;
    }
    return attrs;
  }

  private async resolveM3u8(masterUrl: string) {
    const headers = this.buildHeaders();
    const res = await fetch(masterUrl, { headers });
    if (!res.ok)
      throw new BadRequestException(`Failed to fetch playlist: ${res.status}`);
    const text = await res.text();

    const lines = text.split(/\r?\n/);
    const variants: Array<{ uri: string; quality: string }> = [];
    const subtitles: Array<{
      title: string;
      language: string;
      type: string;
      uri: string;
    }> = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("#EXT-X-STREAM-INF:")) {
        const attrs = this.parseAttributes(
          line.substring("#EXT-X-STREAM-INF:".length)
        );
        const next = lines[i + 1]?.trim();
        if (next && !next.startsWith("#")) {
          const reso = attrs["RESOLUTION"] || "";
          const quality = reso.split("x")[1] || attrs["BANDWIDTH"] || "auto";
          variants.push({
            uri: this.resolveRelative(masterUrl, next),
            quality,
          });
        }
      } else if (line.startsWith("#EXT-X-MEDIA:")) {
        const attrs = this.parseAttributes(
          line.substring("#EXT-X-MEDIA:".length)
        );
        if (
          (attrs["TYPE"] || "").toUpperCase() === "SUBTITLES" &&
          attrs["URI"]
        ) {
          subtitles.push({
            title: attrs["NAME"] || attrs["LANGUAGE"] || "Subtitle",
            language: attrs["LANGUAGE"] || "",
            type: "text/vtt",
            uri: this.resolveRelative(masterUrl, attrs["URI"]),
          });
        }
      }
    }

    if (variants.length === 0) {
      return [
        {
          server: "GogoCDN",
          link: masterUrl,
          type: "m3u8" as const,
          quality: "auto",
          subtitles,
          headers,
        },
      ];
    }

    return variants.map((v) => ({
      server: "GogoCDN",
      link: v.uri,
      type: "m3u8" as const,
      quality: String(v.quality),
      subtitles,
      headers,
    }));
  }

  async getStream(params: { type?: "movie" | "series"; link?: string }) {
    const { type, link } = params;
    if (!link) throw new BadRequestException("link is required");

    const headers = this.buildHeaders();

    const lower = link.toLowerCase();
    let streamType: StreamType = "embed";
    if (lower.includes(".m3u8")) streamType = "m3u8";
    else if (lower.match(/\.(mp4|mkv|webm)(\?|$)/)) streamType = "mp4";

    const absolute = this.absolutize(link);
    if (streamType === "m3u8") {
      return this.resolveM3u8(absolute);
    }

    return [
      {
        server: "GogoCDN",
        link: absolute,
        type: streamType,
        quality: "auto",
        subtitles: [],
        headers,
      },
    ];
  }

  async getDirectStream(params: { path?: string; url?: string }) {
    const { path, url } = params;
    const storageBase = process.env.STORAGE_URL || "";
    const apiBase = process.env.API_BASE_URL || process.env.FRONTEND_URL || "";
    const base = storageBase ? storageBase.replace(/\/$/, "") : "";

    const full = url ? url : path ? `${base}/media/${path}` : "";
    if (!full) throw new BadRequestException("path or url is required");

    const lower = full.toLowerCase();
    const type: StreamType = lower.includes(".m3u8")
      ? "m3u8"
      : lower.match(/\.(mp4|mkv|webm)(\?|$)/)
        ? "mp4"
        : "embed";

    const headers = this.buildHeaders();

    if (type === "m3u8") {
      return this.resolveM3u8(full);
    }

    return {
      server: "GogoCDN",
      link: full,
      type,
      quality: "auto",
      subtitles: [],
      headers,
    };
  }
}
