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
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.findAll),
    );
    this.router.get(
      `${this.path}/me`,
      hasRole([UserRole.user, UserRole.admin]) as any,
      tryCatch(this.controller.findMe),
    );
    this.router.put(
      `${this.path}`,
      hasRole([UserRole.user, UserRole.admin]) as any,
      tryCatch(this.controller.update),
    );
  }
}

export default UserSubscriptionRoute;
