const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693038757634 {
    name = 'Migration1693038757634'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_subscription_comments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "comment" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "present" boolean NOT NULL, "userSubscriptionId" uuid NOT NULL, CONSTRAINT "PK_06e47ea7342e41f56fb536d36bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url_path" character varying, "groom_name" character varying, "bride_name" character varying, "wedding_date" TIMESTAMP, "reception_date" TIMESTAMP, "quotes" text, "picture_path" character varying, "groom_father_name" character varying, "groom_mother_name" character varying, "groom_instagram" character varying, "bride_father_name" character varying, "bride_mother_name" character varying, "bride_instagram" character varying, "love_stories" jsonb, "wedding_address" character varying, "reception_address" character varying, "youtube_url" character varying, "wedding_coordinate" character varying, "reception_coordinate" character varying, "music_url" character varying, "image_path" character varying, "invited_guests" jsonb, "is_active" boolean NOT NULL DEFAULT true, "preset_id" integer, "transaction_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_c8b98bdfc67c6d6da0c59c2799b" UNIQUE ("url_path"), CONSTRAINT "REL_0d64912e329c0b1233d002aedc" UNIQUE ("transaction_id"), CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c8b98bdfc67c6d6da0c59c2799" ON "user_subscriptions" ("url_path") `);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" ADD CONSTRAINT "FK_a74962394b4cbbb5241cd93ec61" FOREIGN KEY ("userSubscriptionId") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_97700ff06831f79c98d69503b5e" FOREIGN KEY ("preset_id") REFERENCES "presets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0d64912e329c0b1233d002aedcb" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0641da02314913e28f6131310eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0641da02314913e28f6131310eb"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0d64912e329c0b1233d002aedcb"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_97700ff06831f79c98d69503b5e"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" DROP CONSTRAINT "FK_a74962394b4cbbb5241cd93ec61"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8b98bdfc67c6d6da0c59c2799"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_subscription_comments"`);
    }
}
