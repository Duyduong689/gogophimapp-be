import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name!: string;

  @ManyToMany(() => Title, (t) => t.tags)
  titles!: Title[];
}


