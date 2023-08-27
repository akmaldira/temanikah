const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693076544288 {
    name = 'Migration1693076544288'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD "view_on_preset" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN "view_on_preset"`);
    }
}
