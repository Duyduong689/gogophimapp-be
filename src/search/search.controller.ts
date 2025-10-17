import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { GetSearchQueryDto, PostItem } from './dto';

@Controller('v1')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get('search')
  async search(@Query() query: GetSearchQueryDto): Promise<PostItem[]> {
    return this.service.getSearch(query);
  }
}


