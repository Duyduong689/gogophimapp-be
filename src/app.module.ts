import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './health.controller';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import { SearchModule } from './search/search.module';
import { MetaModule } from './meta/meta.module';
import { EpisodesModule } from './episodes/episodes.module';
import { StreamModule } from './stream/stream.module';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Title } from './db/entities/title.entity';
import { Tag } from './db/entities/tag.entity';
import { Person } from './db/entities/person.entity';
import { Genre } from './db/entities/genre.entity';
import { LinkGroup } from './db/entities/link-group.entity';
import { DirectLink } from './db/entities/direct-link.entity';
import { Episode } from './db/entities/episode.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? 'password',
      database: process.env.DB_NAME ?? 'gogophim',
      synchronize: true,
      autoLoadEntities: true,
      entities: [Title, Tag, Person, Genre, LinkGroup, DirectLink, Episode],
    }),
    SharedModule,
    PostsModule,
    SearchModule,
    MetaModule,
    EpisodesModule,
    StreamModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

