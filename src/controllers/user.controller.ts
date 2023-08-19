import { userResponseSpec } from "@dtos/users.dto";
import UserRepository from "@repositories/user.repository";
import { Request, Response } from "express";

class UserController {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public findAll = async (req: Request, res: Response) => {
    const users = await this.repository.getAll();

    res.status(200).json({
      error: false,
      data: users.map((user) => userResponseSpec(user)),
    });
  };
}

export default UserController;
