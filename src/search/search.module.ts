import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/movie.entity';
import { Episode } from '../episodes/episode.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Episode])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}


