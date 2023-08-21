import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Subscription } from "./subscription.entity";
import { User } from "./user.entity";
import { Voucher } from "./voucher.entity";

export enum TransactionStatus {
  "declined" = "declined",
  "pending" = "pending",
  "expired" = "expired",
  "canceled" = "canceled",
  "success" = "success",
}

@Entity({ schema: "public", name: "transactions" })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Subscription, subscription => subscription.id, { nullable: false })
  @JoinColumn({ name: "subscription_id" })
  subscription: Subscription;

  @Column("decimal", { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Voucher, voucher => voucher.id, { nullable: true })
  @JoinColumn({ name: "voucher_id" })
  voucher?: Voucher;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: [TransactionStatus.pending],
  })
  status: string;

  @Column("text", { array: true, name: "midtrans_response" })
  midtrans_response: string[];
}
