import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Genre } from './genre.entity';
import { Tag } from './tag.entity';
import { Person } from './person.entity';
import { LinkGroup } from './link-group.entity';
import { Episode } from './episode.entity';


export type TitleType = 'movie' | 'series';

@Entity('titles')
@Index(['type', 'slug'], { unique: true })
export class Title {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, unique: false })
  slug!: string;

  @Column({ type: 'enum', enum: ['movie', 'series'] })
  type!: TitleType;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image!: string | null;

  @Column({ type: 'text', nullable: true })
  synopsis!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  imdbId!: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  rating!: string | null;

  @ManyToMany(() => Genre, (g) => g.titles, { cascade: true })
  @JoinTable({ name: 'title_genres' })
  genres!: Genre[];

  @ManyToMany(() => Tag, (t) => t.titles, { cascade: true })
  @JoinTable({ name: 'title_tags' })
  tags!: Tag[];

  @ManyToMany(() => Person, (p) => p.titles, { cascade: true })
  @JoinTable({ name: 'title_people' })
  cast!: Person[];

  @OneToMany(() => LinkGroup, (lg) => lg.title, { cascade: true })
  linkGroups!: LinkGroup[];

  @OneToMany(() => Episode, (e) => e.title, { cascade: true })
  episodes!: Episode[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


