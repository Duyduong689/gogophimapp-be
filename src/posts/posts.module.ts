import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Title } from '../db/entities/title.entity';
import { Genre } from '../db/entities/genre.entity';
import { Tag } from '../db/entities/tag.entity';
import { Person } from '../db/entities/person.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Title, Genre, Tag, Person])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}


