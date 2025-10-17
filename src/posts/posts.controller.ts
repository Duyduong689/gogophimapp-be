import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { GetPostsQueryDto, PostItem } from './dto';

@Controller('v1')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get('posts')
  async getPosts(@Query() query: GetPostsQueryDto): Promise<PostItem[]> {
    return this.service.getPosts(query);
  }
}


