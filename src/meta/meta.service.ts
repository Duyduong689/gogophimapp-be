import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
  ) {}

  async getMeta(params: { type: 'movie' | 'series'; slug: string }) {
    const { type, slug } = params;
    const movie = await this.movieRepo.findOne({ where: { slug, type } });
    if (!movie) throw new NotFoundException('Movie not found');

    const apiBase = process.env.API_BASE_URL || process.env.FRONTEND_URL || '';
    const storageBase = process.env.STORAGE_URL || '';

    const absolutize = (url?: string) => {
      if (!url) return '';
      if (/^https?:\/\//i.test(url)) return url;
      if (!storageBase) return url;
      return `${storageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    };

    // tags via raw join
    const tagRows = await this.movieRepo.query(
      'SELECT t.name FROM movie_tags mt INNER JOIN tags t ON t.id = mt.tag_id WHERE mt.movie_id = ? ORDER BY t.name ASC',
      [movie.id],
    );
    const tags = tagRows.map((r: any) => r.name).filter(Boolean);

    // actors via raw join
    const castRows = await this.movieRepo.query(
      'SELECT a.name FROM movie_actors ma INNER JOIN actors a ON a.id = ma.actor_id WHERE ma.movie_id = ? ORDER BY a.name ASC',
      [movie.id],
    );
    const cast = castRows.map((r: any) => r.name).filter(Boolean);

    // episodes, grouped by server
    const eps = await this.episodeRepo.find({ where: { movieId: movie.id }, order: { server: 'ASC', id: 'ASC' } });
    const byServer = new Map<string, Episode[]>();
    for (const e of eps) {
      const list = byServer.get(e.server) || [];
      list.push(e);
      byServer.set(e.server, list);
    }

    const linkList = Array.from(byServer.entries()).map(([server, list]) => ({
      title: server,
      quality: 'auto',
      directLinks: list.map((e) => ({
        title: e.name,
        link: absolutize(e.link),
        type: e.type,
      })),
    }));

    return {
      title: movie.name,
      image: absolutize(movie.poster || movie.thumbnail),
      synopsis: movie.description,
      imdbId: movie.imdb_id,
      type: movie.type,
      tags,
      cast,
      rating: String(movie.imdb_rating ?? movie.rating_star ?? ''),
      linkList,
    };
  }
}


