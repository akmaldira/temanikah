import UserController from "@/controllers/user.controller";
import { UserRole } from "@/database/entities/user.entity";
import { tryCatch } from "@/utils/tryCatch";
import { IRoutes } from "@interfaces/route.interface";
import hasRole from "@middlewares/auth.middleware";
import { Router } from "express";

class UserRoute implements IRoutes {
  public path: string;
  public router = Router();
  private controller = new UserController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin]) as any,
      tryCatch(this.controller.findAll),
    );
  }
}

export default UserRoute;
