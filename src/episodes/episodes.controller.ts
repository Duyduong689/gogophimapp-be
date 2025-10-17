import { Controller, Get, Query } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodeLink, GetEpisodesQueryDto } from './dto';

@Controller('v1')
export class EpisodesController {
  constructor(private readonly service: EpisodesService) {}

  @Get('episodes')
  async getEpisodes(@Query() query: GetEpisodesQueryDto): Promise<EpisodeLink[]> {
    return this.service.getEpisodes(query);
  }
}


