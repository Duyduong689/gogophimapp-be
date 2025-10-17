import { Injectable, NotFoundException } from '@nestjs/common';
import { GetMetaQueryDto, Info } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../db/entities/title.entity';
import { LinkGroup } from '../db/entities/link-group.entity';
import { DirectLink } from '../db/entities/direct-link.entity';

@Injectable()
export class MetaService {
  private readonly BASE = 'https://app.gogophim.com/v1';

  constructor(
    @InjectRepository(Title) private readonly titleRepo: Repository<Title>,
    @InjectRepository(LinkGroup) private readonly groupRepo: Repository<LinkGroup>,
    @InjectRepository(DirectLink) private readonly linkRepo: Repository<DirectLink>,
  ) {}

  async getMeta(dto: GetMetaQueryDto): Promise<Info> {
    const title = await this.titleRepo.findOne({ where: { slug: dto.slug, type: dto.type }, relations: ['genres', 'tags', 'cast'] });
    if (!title) throw new NotFoundException('Title not found');

    const groups = await this.groupRepo.find({ where: { title: { id: title.id } }, relations: ['directLinks'] });

    return {
      title: title.title,
      image: title.image ?? '',
      synopsis: title.synopsis ?? '',
      imdbId: title.imdbId ?? '',
      type: title.type,
      tags: (title.tags ?? []).map((t) => t.name),
      cast: (title.cast ?? []).map((p) => p.name),
      rating: title.rating ?? undefined,
      linkList: groups.map((g) => ({
        title: g.titleText,
        quality: g.quality ?? undefined,
        episodesLink: g.episodesLink ?? undefined,
        directLinks: (g.directLinks ?? []).map((dl) => ({ title: dl.title, link: dl.link, type: dl.type })),
      })),
    };
  }
}


