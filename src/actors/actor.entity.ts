import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity('actors')
@Index(['slug'], { unique: true })
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: 'male' | 'female' | 'other';

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  other_name: string;

  @Column({ nullable: true })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Unidirectional ManyToMany to reuse existing join table
  @ManyToMany(() => Movie)
  @JoinTable({
    name: 'movie_actors',
    joinColumn: { name: 'actor_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'movie_id', referencedColumnName: 'id' },
  })
  movies: Movie[];
}


