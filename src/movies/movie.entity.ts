import {
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "movies" })
@Index(["name", "slug"], { unique: true })
@Index(["type", "status"])
@Index(["view_total"])
@Index(["id", "view_total"])
@Index(["slug"], { unique: true })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  origin_name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  poster: string;

  @Column({ type: "enum", enum: ["movie", "series", "tvshows"] })
  type: "movie" | "series" | "tvshows";

  @Column({ type: "enum", enum: ["trailer", "ongoing", "completed"] })
  status: "trailer" | "ongoing" | "completed";

  @Column({ type: "text", nullable: true })
  trailer_url: string;

  @Column({ nullable: true })
  episode_time: string;

  @Column({ nullable: true })
  episode_total: string;

  @Column({ nullable: true })
  episode_current: string;

  @Column({ default: "HD" })
  quality: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true, length: 512 })
  notify: string;

  @Column({ nullable: true, length: 512 })
  showtime: string;

  @Column({ nullable: true })
  publish_year: number;

  @Column({ default: false })
  is_recommended: boolean;

  @Column({ default: 0, type: "int" })
  view_total: number;

  @Column({ default: 0, type: "int" })
  view_day: number;

  @Column({ default: 0, type: "int" })
  view_week: number;

  @Column({ default: 0, type: "int" })
  view_month: number;

  @Column({ default: 0, type: "int" })
  rating_count: number;

  @Column({ default: 0, type: "decimal", precision: 3, scale: 1 })
  rating_star: number;

  @Column({ default: 0, type: "decimal", precision: 3, scale: 1 })
  imdb_rating: number;

  @Column({ nullable: true })
  imdb_id: string;

  @Column({ nullable: true })
  tmdb_id: string;

  @Column({ default: "P" })
  rating: string;

  @Column({ nullable: true })
  image_name: string;

  @Column({ nullable: true })
  partNumber: number;

  @Column({ nullable: true })
  franchiseId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
