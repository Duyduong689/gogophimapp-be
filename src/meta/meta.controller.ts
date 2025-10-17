import { Controller, Get, Query } from '@nestjs/common';
import { MetaService } from './meta.service';

@Controller('meta')
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Get()
  async get(@Query('type') type: 'movie' | 'series', @Query('slug') slug: string) {
    return this.metaService.getMeta({ type, slug });
  }
}


