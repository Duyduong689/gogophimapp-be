import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Episode) private readonly episodeRepository: Repository<Episode>,
  ) {}

  async getSearchPosts(params: { query?: string; page?: string | number; limit?: string | number }) {
    const { query, page, limit } = params;
    const nPage = typeof page === 'string' ? parseInt(page, 10) : Number(page);
    const nLimit = typeof limit === 'string' ? parseInt(limit, 10) : Number(limit);
    const safePage = Number.isFinite(nPage) && nPage > 0 ? nPage : 1;
    const safeLimitBase = Number.isFinite(nLimit) && nLimit > 0 ? nLimit : 20;
    const safeLimit = Math.min(100, safeLimitBase);

    const qb = this.movieRepository.createQueryBuilder('m');
    qb.select(['m.id', 'm.name', 'm.slug', 'm.thumbnail', 'm.poster', 'm.type']);

    if (query && query.trim()) {
      qb.where('m.name LIKE :q OR m.origin_name LIKE :q OR m.slug LIKE :q', {
        q: `%${query.trim()}%`,
      });
    }

    qb.orderBy('m.createdAt', 'DESC');
    qb.skip((safePage - 1) * safeLimit).take(safeLimit);

    const items = await qb.getMany();

    const apiBase = process.env.API_BASE_URL || process.env.FRONTEND_URL || '';
    const storageBase = process.env.STORAGE_URL || '';
    const providerName = (process.env.FRONTEND_NAME || 'gogophim').toLowerCase().replace(/\s+/g, '');

    const absolutize = (url?: string) => {
      if (!url) return '';
      if (/^https?:\/\//i.test(url)) return url;
      if (!storageBase) return url;
      return `${storageBase.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    };

    const ids = items.map((m) => m.id);
    let firstByMovieId = new Map<number, Episode>();
    if (ids.length) {
      const eps = await this.episodeRepository.createQueryBuilder('e')
        .where('e.movieId IN (:...ids)', { ids })
        .orderBy('e.id', 'ASC')
        .getMany();
      for (const e of eps) {
        if (!firstByMovieId.has(e.movieId)) firstByMovieId.set(e.movieId, e);
      }
    }

    return items.map((m) => {
      const first = firstByMovieId.get(m.id);
      return {
        title: m.name,
        link: absolutize(first?.link) || `${apiBase ? apiBase.replace(/\/$/, '') : ''}/phim/${m.slug}`,
        image: absolutize(m.poster || m.thumbnail),
        provider: providerName,
      };
    });
  }
}


