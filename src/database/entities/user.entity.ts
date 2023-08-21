import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Transaction } from "./transactions.entity";

export enum UserRole {
  "admin" = "admin",
  "user" = "user",
}

@Entity({ schema: "public", name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: [UserRole.user],
  })
  role: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true, select: false })
  verification_token: string;

  @Column({ default: false, select: false })
  is_banned: boolean;

  @Column({ nullable: true, select: false })
  banned_reason: string;

  @Column({ nullable: true, select: false })
  banned_at: Date;

  // Relational
  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}
