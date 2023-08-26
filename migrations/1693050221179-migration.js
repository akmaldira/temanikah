const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Migration1693050221179 {
    name = 'Migration1693050221179'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" DROP CONSTRAINT "FK_a74962394b4cbbb5241cd93ec61"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" RENAME COLUMN "userSubscriptionId" TO "user_subscription_id"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" ADD CONSTRAINT "FK_7e16e252a233b61a56071ce741a" FOREIGN KEY ("user_subscription_id") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" DROP CONSTRAINT "FK_7e16e252a233b61a56071ce741a"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" RENAME COLUMN "user_subscription_id" TO "userSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "user_subscription_comments" ADD CONSTRAINT "FK_a74962394b4cbbb5241cd93ec61" FOREIGN KEY ("userSubscriptionId") REFERENCES "user_subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
