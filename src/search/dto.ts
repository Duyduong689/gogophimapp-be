export class GetSearchQueryDto {
  query!: string;
  page?: number;
}

export interface PostItem {
  title: string;
  link: string;
  image: string;
  provider: string;
}


