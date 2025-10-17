import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LinkGroup } from './link-group.entity';

@Entity('direct_links')
export class DirectLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => LinkGroup, (g) => g.directLinks, { onDelete: 'CASCADE' })
  group!: LinkGroup;

  @Column({ type: 'varchar', length: 120 })
  title!: string;

  @Column({ type: 'varchar', length: 500 })
  link!: string;

  @Column({ type: 'enum', enum: ['movie', 'series'], default: 'movie' })
  type!: 'movie' | 'series';
}


