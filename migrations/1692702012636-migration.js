const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692702012636 {
    name = 'Migration1692702012636'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."transactions_payment_name_enum" AS ENUM('bca', 'permata', 'bri', 'bni', 'qris')`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "payment_name" "public"."transactions_payment_name_enum" NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "payment_name"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_payment_name_enum"`);
    }
}
