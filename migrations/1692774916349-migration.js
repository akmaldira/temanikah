const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692774916349 {
    name = 'Migration1692774916349'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vouchers" ADD "deleted_at" TIMESTAMP`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "created_at"`);
    }
}
