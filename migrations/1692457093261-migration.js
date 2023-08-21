const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692457093261 {
  name = "Migration1692457093261";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "features" text array NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "email" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "verification_token" character varying, "is_banned" boolean NOT NULL DEFAULT false, "banned_reason" character varying, "banned_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vouchers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "discount" numeric(10,2) NOT NULL, "min_price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "expired_at" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('declined', 'pending', 'expired', 'canceled', 'success')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "midtrans_response" text array NOT NULL, "user_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TABLE "vouchers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
  }
};
