import VoucherController from "@/controllers/voucher.controller";
import { UserRole } from "@/database/entities/user.entity";
import hasRole from "@/middlewares/auth.middleware";
import { tryCatch } from "@/utils/tryCatch";
import { IRoutes } from "@interfaces/route.interface";
import { Router } from "express";

class VoucherRoute implements IRoutes {
  public path: string;
  public router: any;
  public controller = new VoucherController();

  constructor(path: string) {
    this.path = path;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      `${this.path}`,
      hasRole([UserRole.admin]),
      tryCatch(this.controller.findAll),
    );
    this.router.post(
      `${this.path}`,
      hasRole([UserRole.admin]),
      tryCatch(this.controller.create),
    );
    this.router.delete(
      `${this.path}`,
      hasRole([UserRole.admin]),
      tryCatch(this.controller.delete),
    );
  }
}

export default VoucherRoute;
