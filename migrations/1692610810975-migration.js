const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1692610810975 {
    name = 'Migration1692610810975'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "vouchers" ADD CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6" UNIQUE ("code")`);
        await queryRunner.query(`CREATE INDEX "IDX_efc30b2b9169e05e0e1e19d6dd" ON "vouchers" ("code") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_efc30b2b9169e05e0e1e19d6dd"`);
        await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6"`);
    }
}
