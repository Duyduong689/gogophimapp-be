import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';

@Entity('episodes')
@Index(['title', 'season', 'number'], { unique: true })
export class Episode {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Title, (t) => t.episodes, { onDelete: 'CASCADE' })
  title!: Title;

  @Column({ type: 'int', default: 1 })
  season!: number;

  @Column({ type: 'int' })
  number!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 500 })
  link!: string;
}


