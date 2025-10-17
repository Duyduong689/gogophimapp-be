import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetSearchQueryDto, PostItem } from './dto';
import { Repository } from 'typeorm';
import { Title } from '../db/entities/title.entity';

@Injectable()
export class SearchService {
  private readonly BASE = 'https://app.gogophim.com/v1';

  constructor(@InjectRepository(Title) private readonly titleRepo: Repository<Title>) {}

  private hash(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  }

  async getSearch(dto: GetSearchQueryDto): Promise<PostItem[]> {
    const qb = this.titleRepo
      .createQueryBuilder('t')
      .where('t.title LIKE :q OR t.slug LIKE :q', { q: `%${dto.query}%` })
      .orderBy('t.id', 'DESC')
      .take(20)
      .skip(((dto.page ?? 1) - 1) * 20);
    const rows = await qb.getMany();
    return rows.map((t) => ({
      title: t.title,
      link: `${this.BASE}/${t.type === 'movie' ? 'm' : 's'}/${t.slug}`,
      image: t.image ?? '',
      provider: 'gogophim',
    }));
  }
}


