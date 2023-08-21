import { UserRole } from "@/database/entities/user.entity";
import hasRole from "@/middlewares/auth.middleware";
import TransactionController from "@controllers/transaction.controller";
import { IRoutes } from "@interfaces/route.interface";
import { tryCatch } from "@utils/tryCatch";
import { Router } from "express";

class TransactionRoute implements IRoutes {
  public path: string;
  public router = Router();
  public controller = new TransactionController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.user, UserRole.admin]) as any,
      tryCatch(this.controller.findAll),
    );
    this.router.post(
      `${this.path}`,
      hasRole([UserRole.user, UserRole.admin]) as any,
      tryCatch(this.controller.create),
    );
    this.router.post(
      `${this.path}/notification`,
      tryCatch(this.controller.notification as any),
    );
  }
}

export default TransactionRoute;
