import App from "@/app";
import IndexRoute from "@routes/index.route";
import "reflect-metadata";
import AuthRoute from "./routes/auth.route";
import UserRoute from "./routes/user.route";

const app = new App([
  new IndexRoute("/api/"),
  new AuthRoute("/api/auth"),
  new UserRoute("/api/users"),
]);

app.listen();
