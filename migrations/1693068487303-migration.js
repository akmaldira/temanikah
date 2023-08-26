const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693068487303 {
    name = 'Migration1693068487303'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD "is_visible" boolean NOT NULL DEFAULT true`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "is_visible"`);
    }
}
