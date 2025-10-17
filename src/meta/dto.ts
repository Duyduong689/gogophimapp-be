export class GetMetaQueryDto {
  type!: 'movie' | 'series';
  slug!: string;
}

export interface Info {
  title: string;
  image: string;
  synopsis: string;
  imdbId: string;
  type: 'movie' | 'series';
  tags?: string[];
  cast?: string[];
  rating?: string;
  linkList: Array<{
    title: string;
    quality?: string;
    episodesLink?: string;
    directLinks?: Array<{ title: string; link: string; type: 'movie' | 'series' }>;
  }>;
}


