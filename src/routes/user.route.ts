import UserController from "@controllers/user.controller";
import { UserRole } from "@database/entities/user.entity";
import { IRoutes } from "@interfaces/route.interface";
import hasRole from "@middlewares/auth.middleware";
import { tryCatch } from "@utils/tryCatch";
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
    this.router.get(
      `${this.path}/me`,
      hasRole([UserRole.admin, UserRole.user]) as any,
      tryCatch(this.controller.findMe),
    );
  }
}

export default UserRoute;
