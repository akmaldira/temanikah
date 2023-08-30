import { AppDataSource } from "@database/datasource";
import { UserSubscription } from "@database/entities/userSubscription.entity";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import UserSubscriptionRepository from "@repositories/userSubscription.repository";
import { userSubscriptionBodySpec } from "@validations/userSubscription.validation";
import { Request, Response } from "express";

class UserSubscriptionController {
  private repository: UserSubscriptionRepository;
  constructor() {
    this.repository = new UserSubscriptionRepository(
      UserSubscription,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: RequestWithUser, res: Response) => {
    const { id, skip, take } = req.query;

    if (id) {
      const userSubscription = await this.repository.findOneOrThrow({
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({
        error: false,
        data: userSubscription,
      });
    }

    const [userSubscriptions, total] = await this.repository.findAndCount({
      order: {
        transaction: {
          created_at: "DESC",
        },
      },
      skip: Number(skip) || 0,
      take: Number(take) || 10,
    });

    res.status(200).json({
      error: false,
      data: userSubscriptions,
      total,
    });
  };

  public findByUserId = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { id } = req.query;

    if (!user_id)
      throw new HttpException(400, "User id tidak ditemukan", "USER_ID_NOT_FOUND");

    if (id) {
      const userSubscription = await this.repository.findOneOrThrow({
        where: {
          user: {
            id: user_id,
          },
          id: id as string,
        },
      });

      return res.status(200).json({
        error: false,
        data: userSubscription,
      });
    }

    const userSubscription = await this.repository.find({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    return res.status(200).json({
      error: false,
      data: userSubscription,
    });
  };

  public update = async (req: RequestWithUser, res: Response) => {
    userSubscriptionBodySpec.parse(req.body);

    let userSubscription = await this.repository.findOneOrThrow({
      where: {
        id: req.body.id,
      },
    });

    userSubscription = {
      ...userSubscription,
      ...req.body,
    };

    await this.repository.save(userSubscription);

    return res.status(200).json({
      error: false,
      data: userSubscription,
    });
  };
}

export default UserSubscriptionController;
