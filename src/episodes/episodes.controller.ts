import { Controller, Get, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  async get(@Query('slug') slug: string, @Query('season') season?: string) {
    return this.episodesService.getEpisodes({ slug, season });
  }
}


