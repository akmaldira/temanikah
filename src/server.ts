import App from "@/app";
import AuthRoute from "@routes/auth.route";
import IndexRoute from "@routes/index.route";
import SubscriptionRoute from "@routes/subscription.route";
import TransactionRoute from "@routes/transaction.route";
import UserRoute from "@routes/user.route";
import UserSubscriptionRoute from "@routes/userSubscription.route";
import VoucherRoute from "@routes/voucher.route";
import "reflect-metadata";

const app = new App([
  new IndexRoute("/api"),
  new AuthRoute("/api/auth"),
  new UserRoute("/api/users"),
  new SubscriptionRoute("/api/subscriptions"),
  new VoucherRoute("/api/vouchers"),
  new TransactionRoute("/api/transactions"),
  new UserSubscriptionRoute("/api/user-subscriptions"),
]);

app.listen();
