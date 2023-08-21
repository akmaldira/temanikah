import SubscriptionController from "@controllers/subscription.controller";
import { UserRole } from "@database/entities/user.entity";
import { IRoutes } from "@interfaces/route.interface";
import hasRole from "@middlewares/auth.middleware";
import { tryCatch } from "@utils/tryCatch";
import { Router } from "express";

class SubscriptionRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new SubscriptionController();

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
    this.router.post(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.create),
    );
    this.router.put(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.update),
    );
    this.router.delete(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.delete),
    );
  }
}

export default SubscriptionRoute;
