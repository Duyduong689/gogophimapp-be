export class GetPostsQueryDto {
  filter?: string;
  genre?: string;
  page?: number;
}

export interface PostItem {
  title: string;
  link: string;
  image: string;
  provider: string;
}


