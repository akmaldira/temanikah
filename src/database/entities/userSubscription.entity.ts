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
  imagePath: string;
  description: string;
};

@Entity({ schema: "public", name: "user_subscriptions" })
export class UserSubscription extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Unique(["url_path"])
  @Column({ name: "url_path", nullable: true })
  urlPath: string;

  @Column({ name: "groom_name", nullable: true })
  groomName: string;

  @Column({ name: "bride_name", nullable: true })
  brideName: string;

  @Column({ name: "wedding_date", nullable: true })
  weddingDate: Date;

  @Column({ name: "reception_date", nullable: true })
  receptionDate: Date;

  @Column("text", { name: "quotes", nullable: true })
  quotes: string;

  @Column("text", { name: "quotes2", nullable: true })
  quotes2: string;

  @Column({ name: "picture_path", nullable: true })
  picturePath: string;

  @Column({ name: "groom_father_name", nullable: true })
  groomFatherName: string;

  @Column({ name: "groom_mother_name", nullable: true })
  groomMotherName: string;

  @Column({ name: "groom_instagram", nullable: true })
  groomInstagram: string;

  @Column({ name: "bride_father_name", nullable: true })
  brideFatherName: string;

  @Column({ name: "bride_mother_name", nullable: true })
  brideMotherName: string;

  @Column({ name: "bride_instagram", nullable: true })
  brideInstagram: string;

  @Column({
    type: "jsonb",
    name: "love_stories",
    nullable: true,
  })
  loveStories: UserLoveStories[];

  @Column({ name: "wedding_address", nullable: true })
  weddingAddress: string;

  @Column({ name: "reception_address", nullable: true })
  receptionAddress: string;

  @Column({ name: "youtube_url", nullable: true })
  youtubeUrl: string;

  @Column({ name: "wedding_coordinate", nullable: true })
  weddingCoordinate: string;

  @Column({ name: "reception_coordinate", nullable: true })
  receptionCoordinate: string;

  @Column({ name: "music_url", nullable: true })
  musicUrl: string;

  @Column({ name: "image_path", nullable: true })
  imagePath: string;

  @Column({
    type: "jsonb",
    name: "invited_guests",
    nullable: true,
  })
  invitedGuests: string[];

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @ManyToOne(() => Preset, preset => preset.id, { nullable: true })
  @JoinColumn({ name: "preset_id" })
  preset: Relation<Preset>;

  @OneToOne(() => Transaction, transaction => transaction.id, { nullable: false })
  @JoinColumn({ name: "transaction_id" })
  transaction: Relation<Transaction>;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @OneToMany(
    () => UserSubscriptionComment,
    userSubscriptionComment => userSubscriptionComment.id,
  )
  userSubscriptionComments: UserSubscriptionComment[];
}
