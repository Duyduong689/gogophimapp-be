import { PostsService } from './posts.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('filter') filter?: string,
    @Query('genre') genre?: string,
  ) {
    return this.postsService.getPosts({ page, limit, filter, genre });
  }

  @Get('search')
  async search(
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.postsService.getSearchPosts({ query, page, limit });
  }
}


