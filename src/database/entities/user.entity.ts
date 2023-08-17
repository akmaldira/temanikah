import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export enum UserRole {
  "admin" = "admin",
  "user" = "user",
}

@Entity({ schema: "public", name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: UserRole,
    array: true,
    default: [UserRole.user],
  })
  role: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ default: false })
  is_banned: boolean;

  @Column({ nullable: true })
  banned_reason: string;

  @Column({ nullable: true })
  banned_at: Date;
}
