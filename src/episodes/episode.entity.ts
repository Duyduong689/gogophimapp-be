import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity('episodes')
@Index(['movieId', 'name'])
@Index(['server'])
@Index(['slug', 'movieId', 'server'])
@Index(['movieId', 'slug'])
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  server: string;

  @Column()
  slug: string;

  @Column({ enum: ['m3u8', 'mp4', 'embed'], type: 'enum' })
  type: 'm3u8' | 'mp4' | 'embed';

  @Column({ nullable: true })
  link: string;

  @Column({ nullable: true })
  poster: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ nullable: true })
  config: string;

  @Column()
  movieId: number;

  @Column({ default: 0, type: 'int' })
  has_report: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}


