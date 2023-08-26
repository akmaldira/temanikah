const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693032658666 {
    name = 'Migration1693032658666'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."presets_category_enum" AS ENUM('basic', 'medium', 'premium', 'exclusive')`);
        await queryRunner.query(`CREATE TABLE "presets" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "banner" character varying NOT NULL, "description" character varying, "category" "public"."presets_category_enum" array NOT NULL, CONSTRAINT "PK_87dcddfb798d56670dc16403854" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "presets"`);
        await queryRunner.query(`DROP TYPE "public"."presets_category_enum"`);
    }
}
