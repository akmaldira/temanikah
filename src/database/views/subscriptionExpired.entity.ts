import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `
select us.user_id as "user_id", us.id as "subscription_id", t.id as "transaction_id", DATE(us.created_at) + s.duration as "expired_date"
	from user_subscriptions us 
	join transactions t ON t.id = us.transaction_id 
	join subscriptions s on s.id = t.subscription_id 
`,
  name: "subscription_expired",
})
export class SubscriptionExpired {
  @ViewColumn()
  user_id: string;

  @ViewColumn()
  subscription_id: string;

  @ViewColumn()
  transaction_id: string;

  @ViewColumn()
  expired_date: Date;
}
