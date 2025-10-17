import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from './episode.entity';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Episode])],
  controllers: [EpisodesController],
  providers: [EpisodesService],
})
export class EpisodesModule {}


