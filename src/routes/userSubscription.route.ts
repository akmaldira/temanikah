import UserSubscriptionController from "@controllers/userSubscription.controller";
import { UserRole } from "@database/entities/user.entity";
import { IRoutes } from "@interfaces/route.interface";
import hasRole from "@middlewares/auth.middleware";
import { tryCatch } from "@utils/tryCatch";
import { Router } from "express";

class UserSubscriptionRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new UserSubscriptionController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.user]) as any,
      tryCatch(this.controller.findAll),
    );
    this.router.get(`${this.path}/:path`, tryCatch(this.controller.findByPath));
    this.router.put(
      `${this.path}`,
      hasRole([UserRole.admin, UserRole.user]) as any,
      tryCatch(this.controller.update),
    );
  }
}

export default UserSubscriptionRoute;
