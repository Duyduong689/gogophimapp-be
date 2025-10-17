import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Title } from '../db/entities/title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Title])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}


