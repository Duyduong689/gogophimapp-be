import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';

@Entity('people')
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @ManyToMany(() => Title, (t) => t.cast)
  titles!: Title[];
}


