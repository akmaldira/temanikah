import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ColumnNumericTransformer } from "../utils/columnNumericTransformer";

@Entity({ schema: "public", name: "vouchers" })
export class Voucher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Unique("voucher_code", ["code"])
  @Index()
  @Column()
  code: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  discount: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
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
