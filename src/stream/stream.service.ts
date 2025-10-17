import { Injectable } from '@nestjs/common';
import { GetDirectQueryDto, GetStreamQueryDto, StreamItem } from './dto';
import { StreamResolver } from './resolver';

@Injectable()
export class StreamService {
  constructor(private readonly resolver: StreamResolver) {}

  private hash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  }

  async resolve(dto: GetStreamQueryDto): Promise<StreamItem[]> {
    const headers = this.resolver.headers();
    const urls = /\.m3u8|\.mp4/.test(dto.link) ? [dto.link] : await this.resolver.resolveOnce(dto.link);
    return urls.slice(0, 5).map((url) => ({
      server: 'GogoCDN',
      link: url,
      type: /\.m3u8/.test(url) ? 'm3u8' : /\.mp4/.test(url) ? 'mp4' : 'unknown',
      quality: '1080',
      subtitles: [
        { title: 'Tiếng Việt', language: 'vi', type: 'text/vtt', uri: 'https://cdn.gogophim.com/subs/inception-vi.vtt' },
        { title: 'English', language: 'en', type: 'text/vtt', uri: 'https://cdn.gogophim.com/subs/inception-en.vtt' },
      ],
      headers,
    }));
  }

  async direct(dto: GetDirectQueryDto): Promise<StreamItem> {
    const headers = this.resolver.headers();
    const url = dto.url;
    return {
      server: 'GogoCDN',
      link: url,
      type: /\.m3u8/.test(url) ? 'm3u8' : /\.mp4/.test(url) ? 'mp4' : 'unknown',
      quality: undefined,
      subtitles: [],
      headers,
    };
  }
}


