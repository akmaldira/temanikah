import { Request, Response } from "express";

class IndexController {
  public index = (req: Request, res: Response) => {
    res.status(200).send("Hello World");
  };
}

export default IndexController;
