import { AppDataSource } from "@database/datasource";
import { User } from "@database/entities/user.entity";
import { userResponseSpec } from "@dtos/users.dto";
import { RequestWithUser } from "@interfaces/route.interface";
import UserRepository from "@repositories/user.repository";
import { Request, Response } from "express";

class UserController {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository(
      User,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: Request, res: Response) => {
    const users = await this.repository.find();

    res.status(200).json({
      error: false,
      data: users.map(user => userResponseSpec(user)),
    });
  };

  public findMe = async (req: RequestWithUser, res: Response) => {
    const user = await this.repository.findOne({
      where: {
        id: req.user!.id,
      },
    });

    res.status(200).json({
      error: false,
      data: userResponseSpec(user!),
    });
  };
}

export default UserController;
