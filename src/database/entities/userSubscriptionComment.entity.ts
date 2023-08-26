import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { UserSubscription } from "./userSubscription.entity";

@Entity({ schema: "public", name: "user_subscription_comments" })
export class UserSubscriptionComment extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  comment: string;

  @Column()
  date: Date;

  @Column()
  present: boolean;

  @ManyToOne(() => UserSubscription, userSubscription => userSubscription.id, {
    nullable: false,
  })
  @JoinColumn({ name: "user_subscription_id" })
  user_subscription: Relation<UserSubscription>;
}
