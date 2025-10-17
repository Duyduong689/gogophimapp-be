import { Movie } from "src/movies/movie.entity";
import { Episode } from "src/episodes/episode.entity";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";


@Module({
  imports: [TypeOrmModule.forFeature([Movie, Episode])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}


