import { Injectable } from '@nestjs/common';
import { EpisodeLink, GetEpisodesQueryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from '../db/entities/episode.entity';
import { Title } from '../db/entities/title.entity';

@Injectable()
export class EpisodesService {
  private readonly BASE = 'https://app.gogophim.com/v1';

  constructor(
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
    @InjectRepository(Title) private readonly titleRepo: Repository<Title>,
  ) {}

  async getEpisodes(dto: GetEpisodesQueryDto): Promise<EpisodeLink[]> {
    const title = await this.titleRepo.findOne({ where: { slug: dto.slug, type: 'series' as const } });
    if (!title) return [];
    const rows = await this.episodeRepo.find({ where: { title: { id: title.id }, season: dto.season ?? 1 }, order: { number: 'ASC' } });
    return rows.map((e) => ({ title: e.name, link: `${this.BASE}/s/${dto.slug}/tap-${e.number}` }));
  }
}


