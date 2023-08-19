import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColumnNumericTransformer } from "../utils/columnNumericTransformer";

@Entity({ schema: "public", name: "subscriptions" })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @Column("text", { array: true })
  features: string[];

  @Column()
  duration: number;
}