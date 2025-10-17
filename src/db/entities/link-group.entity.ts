import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Title } from './title.entity';
import { DirectLink } from './direct-link.entity';

@Entity('link_groups')
export class LinkGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Title, (t) => t.linkGroups, { onDelete: 'CASCADE' })
  title!: Title;

  @Column({ type: 'varchar', length: 120 })
  titleText!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  quality!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  episodesLink!: string | null;

  @OneToMany(() => DirectLink, (dl) => dl.group, { cascade: true })
  directLinks!: DirectLink[];
}


