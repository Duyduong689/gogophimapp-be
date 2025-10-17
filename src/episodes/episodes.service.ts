import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from './episode.entity';

@Injectable()
export class EpisodesService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
  ) {}

  async getEpisodes(params: { slug: string; season?: string | number }) {
    const { slug } = params;
    const movie = await this.movieRepo.findOne({ where: { slug } });
    if (!movie) throw new NotFoundException('Series not found');

    const apiBase = process.env.API_BASE_URL || process.env.FRONTEND_URL || '';
    const base = apiBase ? apiBase.replace(/\/$/, '') : '';
    const storageBase = process.env.STORAGE_URL || '';

    const absolutize = (url?: string) => {
      if (!url) return '';
      if (/^https?:\/\//i.test(url)) return url;
      if (!storageBase) return url;
      return `${storageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    };

    const eps = await this.episodeRepo.find({ where: { movieId: movie.id }, order: { id: 'ASC' } });
    return eps.map((e) => ({
      title: e.name,
      link: absolutize(e.link),
    }));
  }
}


