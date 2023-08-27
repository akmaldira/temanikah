import { AppDataSource } from "@database/datasource";
import { UserSubscription } from "@database/entities/userSubscription.entity";
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
    const { id } = req.query;

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

    const user = req.user;
    let userSubscriptions: UserSubscription[] = [];

    if (user && user.role === "admin") {
      userSubscriptions = await this.repository.find({
        order: {
          transaction: {
            created_at: "DESC",
          },
        },
      });
    } else {
      userSubscriptions = await this.repository.find({
        where: {
          user: {
            id: user!.id,
          },
        },
        order: {
          transaction: {
            created_at: "DESC",
          },
        },
      });
    }

    res.status(200).json({
      error: false,
      data: userSubscriptions,
    });
  };

  public findByPath = async (req: Request, res: Response) => {
    const { path } = req.params;

    const userSubscription = await this.repository.findOneOrThrow({
      where: {
        url_path: path,
      },
    });

    userSubscription.view_count += 1;

    await this.repository.save(userSubscription);

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
