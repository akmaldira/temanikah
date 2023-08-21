const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692466737783 {
  name = "Migration1692466737783";

  async up(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "duration" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "subscription_id" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" ADD "voucher_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_082a872afa121a69b68fbf3e121" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_086ea3f27fe3d9ae5198a4f254e" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_086ea3f27fe3d9ae5198a4f254e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_082a872afa121a69b68fbf3e121"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "voucher_id"`);
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "subscription_id"`);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "duration"`);
  }
};
