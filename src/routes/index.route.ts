import IndexController from "@controllers/index.controller";
import { IRoutes } from "@interfaces/route.interface";
import { tryCatch } from "@utils/tryCatch";
import { Router } from "express";

class IndexRoute implements IRoutes {
  public path: string;
  public router = Router();
  private controller = new IndexController();

  constructor(path: string) {
    this.path = path;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, tryCatch(this.controller.index));
  }
}

export default IndexRoute;
