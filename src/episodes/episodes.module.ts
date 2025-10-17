import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodesController } from './episodes.controller';
import { EpisodesService } from './episodes.service';
import { Episode } from '../db/entities/episode.entity';
import { Title } from '../db/entities/title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Episode, Title])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}


