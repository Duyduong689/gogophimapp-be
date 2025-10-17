import { Injectable } from '@nestjs/common';
import { HttpService } from '../shared/http/http.service';

const DEFAULT_HEADERS = {
  Referer: 'https://app.gogophim.com/',
  Origin: 'https://app.gogophim.com',
  'User-Agent':
    process.env.PROXY_UA_MOBILE ??
    'Mozilla/5.0 (Android 13; Mobile) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
};

@Injectable()
export class StreamResolver {
  constructor(private readonly http: HttpService) {}

  private isDirect(url: string): boolean {
    return /\.m3u8(\?.*)?$/.test(url) || /\.mp4(\?.*)?$/.test(url);
  }

  async resolveOnce(url: string): Promise<string[]> {
    if (this.isDirect(url)) return [url];
    const html = await this.http.getText(url, { timeoutMs: 6000 });
    const candidates = new Set<string>();

    const urlRegex = /(https:\/\/[^\s"'<>\\)]+?\.(m3u8|mp4)(\?[^\s"'<>\\)]*)?)/gi;
    let match: RegExpExecArray | null;
    while ((match = urlRegex.exec(html)) !== null) candidates.add(match[1]);

    const jsonLike = /"file"\s*:\s*"(https:\/\/[^\"]+?\.(m3u8|mp4)[^\"]*)"/gi;
    while ((match = jsonLike.exec(html)) !== null) candidates.add(match[1]);

    return Array.from(candidates);
  }

  headers(): Record<string, string> {
    return { ...DEFAULT_HEADERS };
  }
}


