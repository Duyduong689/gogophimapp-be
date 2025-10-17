import { Injectable } from '@nestjs/common';
import { GetPostsQueryDto, PostItem } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../db/entities/title.entity';
import { Genre } from '../db/entities/genre.entity';

@Injectable()
export class PostsService {
  private readonly BASE = 'https://app.gogophim.com/v1';

  constructor(
    @InjectRepository(Title) private readonly titleRepo: Repository<Title>,
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
  ) {}

  async getPosts(dto: GetPostsQueryDto): Promise<PostItem[]> {
    const take = 20;
    const skip = ((dto.page ?? 1) - 1) * take;

    if (dto.genre && !dto.filter) {
      const genre = await this.genreRepo.findOne({ where: { slug: dto.genre }, relations: ['titles'] });
      const titles = (genre?.titles ?? []).slice(skip, skip + take);
      return titles.map((t) => ({
        title: t.title,
        link: `${this.BASE}/${t.type === 'movie' ? 'm' : 's'}/${t.slug}`,
        image: t.image ?? '',
        provider: 'gogophim',
      }));
    }

    // filter-based can map to some internal flag; here default to latest
    const rows = await this.titleRepo.find({ order: { id: 'DESC' }, take, skip });
    return rows.map((t) => ({
      title: t.title,
      link: `${this.BASE}/${t.type === 'movie' ? 'm' : 's'}/${t.slug}`,
      image: t.image ?? '',
      provider: 'gogophim',
    }));
  }
}


