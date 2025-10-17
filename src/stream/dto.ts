export class GetStreamQueryDto {
  type!: 'movie' | 'series';
  link!: string;
}

export class GetDirectQueryDto {
  url!: string;
}

export interface Subtitle {
  title: string;
  language: string;
  type: 'text/vtt' | 'application/x-subrip' | 'application/ttml+xml';
  uri: string;
}

export interface StreamItem {
  server: string;
  link: string;
  type: 'm3u8' | 'mp4' | string;
  quality?: string;
  subtitles?: Subtitle[];
  headers?: Record<string, string>;
}


