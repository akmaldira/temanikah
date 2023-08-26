import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export enum PresetCategory {
  basic = "basic",
  medium = "medium",
  premium = "premium",
  exclusive = "exclusive",
}

@Entity({ schema: "public", name: "presets" })
export class Preset extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  banner: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: PresetCategory,
    array: true,
  })
  category: PresetCategory[];
}
