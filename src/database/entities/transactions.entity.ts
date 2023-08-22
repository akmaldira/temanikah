import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { ColumnNumericTransformer } from "../utils/columnNumericTransformer";
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

export enum PaymentType {
  "bank_transfer" = "bank_transfer",
  "qris" = "qris",
}

export enum BankType {
  "bca" = "bca",
  "permata" = "permata",
  "bri" = "bri",
  "bni" = "bni",
  "qris" = "qris",
}

@Entity({ schema: "public", name: "transactions" })
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: Relation<User>;

  @ManyToOne(() => Subscription, subscription => subscription.id, { nullable: false })
  @JoinColumn({ name: "subscription_id" })
  subscription: Relation<Subscription>;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @ManyToOne(() => Voucher, voucher => voucher.id, { nullable: true })
  @JoinColumn({ name: "voucher_id" })
  voucher?: Relation<Voucher>;

  @Column({
    type: "enum",
    enum: TransactionStatus,
    default: [TransactionStatus.pending],
  })
  status: string;

  @Column({
    type: "enum",
    enum: PaymentType,
  })
  payment_type: PaymentType;

  @Column({
    type: "enum",
    enum: BankType,
  })
  payment_name: BankType;

  @Column("text", { array: true, name: "midtrans_response" })
  midtrans_response: string[];

  @Column({ nullable: true })
  va_number: string;
}
