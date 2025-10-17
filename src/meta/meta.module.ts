import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/movie.entity';
import { Actor } from '../actors/actor.entity';
import { Episode } from '../episodes/episode.entity';
import { MetaService } from './meta.service';
import { MetaController } from './meta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Actor, Episode])],
  controllers: [MetaController],
  providers: [MetaService],
})
export class MetaModule {}


