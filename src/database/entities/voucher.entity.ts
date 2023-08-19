import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "public", name: "vouchers" })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column("decimal", { precision: 10, scale: 2 })
  discount: number;

  @Column("decimal", { precision: 10, scale: 2 })
  min_price: number;

  @Column()
  stock: number;

  @Column()
  expired_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  description: string;
}
