import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ManyToMany(() => Title, (t) => t.genres)
  titles!: Title[];
}


