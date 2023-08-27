const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693120419065 {
    name = 'Migration1693120419065'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "subscriptions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "features" text array NOT NULL, "duration" integer NOT NULL, "is_visible" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vouchers" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying NOT NULL, "discount" numeric(10,2) NOT NULL, "min_price" numeric(10,2) NOT NULL, "stock" integer NOT NULL, "expired_at" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "description" character varying, CONSTRAINT "voucher_code" UNIQUE ("code"), CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_efc30b2b9169e05e0e1e19d6dd" ON "vouchers" ("code") `);
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('declined', 'pending', 'expired', 'canceled', 'success')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_payment_type_enum" AS ENUM('bank_transfer', 'qris')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_payment_name_enum" AS ENUM('bca', 'permata', 'bri', 'bni', 'qris')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "payment_type" "public"."transactions_payment_type_enum" NOT NULL, "payment_name" "public"."transactions_payment_name_enum" NOT NULL, "midtrans_response" text array NOT NULL, "va_number" character varying, "user_id" uuid NOT NULL, "subscription_id" integer NOT NULL, "voucher_id" integer, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "email" character varying NOT NULL, "password" character varying NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, "verification_token" character varying, "is_banned" boolean NOT NULL DEFAULT false, "banned_reason" character varying, "banned_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."presets_category_enum" AS ENUM('basic', 'medium', 'premium', 'exclusive')`);
        await queryRunner.query(`CREATE TABLE "presets" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "banner" character varying NOT NULL, "description" character varying, "category" "public"."presets_category_enum" array NOT NULL, CONSTRAINT "PK_87dcddfb798d56670dc16403854" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subscription_comments" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "comment" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "present" boolean NOT NULL, "user_subscription_id" uuid NOT NULL, CONSTRAINT "PK_06e47ea7342e41f56fb536d36bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_subscriptions" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url_path" character varying, "groom_name" character varying, "bride_name" character varying, "wedding_date" TIMESTAMP, "reception_date" TIMESTAMP, "quotes" text, "quotes2" text, "picture_path" character varying, "groom_father_name" character varying, "groom_mother_name" character varying, "groom_instagram" character varying, "bride_father_name" character varying, "bride_mother_name" character varying, "bride_instagram" character varying, "love_stories" jsonb, "wedding_address" character varying, "reception_address" character varying, "youtube_url" character varying, "wedding_coordinate" character varying, "reception_coordinate" character varying, "music_url" character varying, "image_path" character varying, "invited_guests" jsonb, "is_active" boolean NOT NULL DEFAULT true, "view_count" integer NOT NULL DEFAULT '0', "view_on_preset" boolean NOT NULL DEFAULT false, "preset_id" integer, "transaction_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "UQ_c8b98bdfc67c6d6da0c59c2799b" UNIQUE ("url_path"), CONSTRAINT "REL_0d64912e329c0b1233d002aedc" UNIQUE ("transaction_id"), CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c8b98bdfc67c6d6da0c59c2799" ON "user_subscriptions" ("url_path") `);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_082a872afa121a69b68fbf3e121" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_086ea3f27fe3d9ae5198a4f254e" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" ADD CONSTRAINT "FK_7e16e252a233b61a56071ce741a" FOREIGN KEY ("user_subscription_id") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_97700ff06831f79c98d69503b5e" FOREIGN KEY ("preset_id") REFERENCES "presets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0d64912e329c0b1233d002aedcb" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_0641da02314913e28f6131310eb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE VIEW "subscription_expired" AS 
select us.user_id as "user_id", us.id as "subscription_id", t.id as "transaction_id", DATE(us.created_at) + s.duration as "expired_date"
	from user_subscriptions us 
	join transactions t ON t.id = us.transaction_id 
	join subscriptions s on s.id = t.subscription_id 
`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","subscription_expired","select us.user_id as \"user_id\", us.id as \"subscription_id\", t.id as \"transaction_id\", DATE(us.created_at) + s.duration as \"expired_date\"\n\tfrom user_subscriptions us \n\tjoin transactions t ON t.id = us.transaction_id \n\tjoin subscriptions s on s.id = t.subscription_id"]);
    }

    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","subscription_expired","public"]);
        await queryRunner.query(`DROP VIEW "subscription_expired"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0641da02314913e28f6131310eb"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_0d64912e329c0b1233d002aedcb"`);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_97700ff06831f79c98d69503b5e"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" DROP CONSTRAINT "FK_7e16e252a233b61a56071ce741a"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_086ea3f27fe3d9ae5198a4f254e"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_082a872afa121a69b68fbf3e121"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8b98bdfc67c6d6da0c59c2799"`);
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP TABLE "user_subscription_comments"`);
        await queryRunner.query(`DROP TABLE "presets"`);
        await queryRunner.query(`DROP TYPE "public"."presets_category_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_payment_name_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_payment_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_efc30b2b9169e05e0e1e19d6dd"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
    }
}
