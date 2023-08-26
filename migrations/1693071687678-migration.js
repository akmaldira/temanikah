const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693071687678 {
    name = 'Migration1693071687678'

    async up(queryRunner) {
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
    }
}
