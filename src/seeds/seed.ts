import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { DataSource } from 'typeorm';
import { Title } from '../db/entities/title.entity';
import { Genre } from '../db/entities/genre.entity';
import { Tag } from '../db/entities/tag.entity';
import { Person } from '../db/entities/person.entity';
import { LinkGroup } from '../db/entities/link-group.entity';
import { DirectLink } from '../db/entities/direct-link.entity';
import { Episode } from '../db/entities/episode.entity';

const ds = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'password',
  database: process.env.DB_NAME ?? 'gogophimapp',
  synchronize: true,
  entities: [Title, Genre, Tag, Person, LinkGroup, DirectLink, Episode],
});

async function run() {
  await ds.initialize();

  const genreSlugs = ['hanh-dong', 'vien-tuong', 'hai-huoc', 'tinh-cam', 'kinh-di'];
  const genres = await Promise.all(
    genreSlugs.map((slug) => ds.getRepository(Genre).save({ slug, name: slug.replace('-', ' ') })),
  );

  const tags = await Promise.all(
    ['Hành động', 'Khoa học viễn tưởng', 'Hài', 'Tâm lý', 'Phiêu lưu'].map((name) =>
      ds.getRepository(Tag).save({ name }),
    ),
  );

  const people = await Promise.all(
    ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Tom Cruise', 'Hayden Christensen', 'Emma Stone'].map(
      (name) => ds.getRepository(Person).save({ name }),
    ),
  );

  // 10 movies
  for (let i = 1; i <= 10; i++) {
    const slug = i === 1 ? 'inception-2010' : `movie-${i}`;
    const title = await ds.getRepository(Title).save({
      title: i === 1 ? 'Inception' : `Movie ${i}`,
      slug,
      type: 'movie',
      image: i === 1 ? 'https://cdn.gogophim.com/posters/inception.jpg' : `https://cdn.gogophim.com/posters/movie-${i}.jpg`,
      synopsis:
        i === 1
          ? 'Dom Cobb là một kẻ trộm bậc thầy có khả năng xâm nhập giấc mơ...'
          : `Synopsis for movie ${i}`,
      imdbId: i === 1 ? 'tt1375666' : `tt00000${i}`,
      rating: '8.8',
    });
    title.genres = [genres[i % genres.length]];
    title.tags = [tags[i % tags.length]];
    title.cast = [people[i % people.length]];
    await ds.getRepository(Title).save(title);

    const group = await ds.getRepository(LinkGroup).save({
      title,
      titleText: 'Server A 1080p',
      quality: '1080',
      episodesLink: null,
    });
    await ds.getRepository(DirectLink).save({
      group,
      title: 'M3U8',
      link: `https://cdn.gogophim.com/media/${slug}/index.m3u8`,
      type: 'movie',
    });
  }

  // 10 series with 2 episodes each (season 1)
  for (let i = 1; i <= 10; i++) {
    const slug = i === 1 ? 'dao-hai-tac' : `series-${i}`;
    const title = await ds.getRepository(Title).save({
      title: i === 1 ? 'Đảo Hải Tặc (One Piece)' : `Series ${i}`,
      slug,
      type: 'series',
      image:
        i === 1
          ? 'https://cdn.gogophim.com/posters/onepiece.jpg'
          : `https://cdn.gogophim.com/posters/series-${i}.jpg`,
      synopsis: `Synopsis for series ${i}`,
      imdbId: `tt10000${i}`,
      rating: '8.0',
    });
    title.genres = [genres[(i + 1) % genres.length]];
    title.tags = [tags[(i + 1) % tags.length]];
    title.cast = [people[(i + 1) % people.length]];
    await ds.getRepository(Title).save(title);

    const group = await ds.getRepository(LinkGroup).save({
      title,
      titleText: 'Server A 1080p',
      quality: '1080',
      episodesLink: `https://app.gogophim.com/v1/s/${slug}/season-1`,
    });

    // Direct link example per spec is optional for series; add none here

    await ds.getRepository(Episode).save({ title, season: 1, number: 1, name: 'Tập 1', link: `https://app.gogophim.com/v1/s/${slug}/tap-1` });
    await ds.getRepository(Episode).save({ title, season: 1, number: 2, name: 'Tập 2', link: `https://app.gogophim.com/v1/s/${slug}/tap-2` });
  }

  // Extra genres for listing by genre testing
  for (let i = 6; i <= 10; i++) {
    await ds.getRepository(Genre).save({ slug: `genre-${i}`, name: `Genre ${i}` });
  }

  // eslint-disable-next-line no-console
  console.log('Seed complete');
  await ds.destroy();
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});


