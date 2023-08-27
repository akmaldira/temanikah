import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Preset } from "./preset.entity";
import { Transaction } from "./transactions.entity";
import { User } from "./user.entity";
import { UserSubscriptionComment } from "./userSubscriptionComment.entity";

export type UserLoveStories = {
  name: string;
  image_path: string;
  description: string;
};

@Entity({ schema: "public", name: "user_subscriptions" })
export class UserSubscription extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Unique(["url_path"])
  @Column({ name: "url_path", nullable: true })
  url_path: string;

  @Column({ name: "groom_name", nullable: true })
  groom_name: string;

  @Column({ name: "bride_name", nullable: true })
  bride_name: string;

  @Column({ name: "wedding_date", nullable: true })
  wedding_date: Date;

  @Column({ name: "reception_date", nullable: true })
  reception_date: Date;

  @Column("text", { name: "quotes", nullable: true })
  quotes: string;

  @Column("text", { name: "quotes2", nullable: true })
  quotes2: string;

  @Column({ name: "picture_path", nullable: true })
  picture_path: string;

  @Column({ name: "groom_father_name", nullable: true })
  groom_father_name: string;

  @Column({ name: "groom_mother_name", nullable: true })
  groom_mother_name: string;

  @Column({ name: "groom_instagram", nullable: true })
  groom_instagram: string;

  @Column({ name: "bride_father_name", nullable: true })
  bride_father_name: string;

  @Column({ name: "bride_mother_name", nullable: true })
  bride_mother_name: string;

  @Column({ name: "bride_instagram", nullable: true })
  bride_instagram: string;

  @Column({
    type: "jsonb",
    name: "love_stories",
    nullable: true,
  })
  love_stories: UserLoveStories[];

  @Column({ name: "wedding_address", nullable: true })
  wedding_address: string;

  @Column({ name: "reception_address", nullable: true })
  reception_address: string;

  @Column({ name: "youtube_url", nullable: true })
  youtube_url: string;

  @Column({ name: "wedding_coordinate", nullable: true })
  wedding_coordinate: string;

  @Column({ name: "reception_coordinate", nullable: true })
  reception_coordinate: string;

  @Column({ name: "music_url", nullable: true })
  music_url: string;

  @Column({ name: "image_path", nullable: true })
  image_path: string;

  @Column({
    type: "jsonb",
    name: "invited_guests",
    nullable: true,
  })
  invited_guests: string[];

  @Column({ name: "is_active", default: true })
  is_active: boolean;

  @ManyToOne(() => Preset, preset => preset.id, { nullable: true })
  @JoinColumn({ name: "preset_id" })
  preset: Relation<Preset>;

  @OneToOne(() => Transaction, transaction => transaction.id, { nullable: false })
  @JoinColumn({ name: "transaction_id" })
  transaction: Relation<Transaction>;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @Column({ name: "view_on_preset", default: false })
  view_on_preset: boolean;

  @OneToMany(
    () => UserSubscriptionComment,
    userSubscriptionComment => userSubscriptionComment.id,
  )
  user_subscription_comments: UserSubscriptionComment[];
}
