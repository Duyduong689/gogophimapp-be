import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaController } from './meta.controller';
import { MetaService } from './meta.service';
import { Title } from '../db/entities/title.entity';
import { LinkGroup } from '../db/entities/link-group.entity';
import { DirectLink } from '../db/entities/direct-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Title, LinkGroup, DirectLink])],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}


