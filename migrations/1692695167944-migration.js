const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692695167944 {
    name = 'Migration1692695167944'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."transactions_payment_type_enum" AS ENUM('bank_transfer', 'qris')`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "payment_type" "public"."transactions_payment_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "va_number" character varying`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "va_number"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "payment_type"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_payment_type_enum"`);
    }
}
