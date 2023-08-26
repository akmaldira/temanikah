import { AppDataSource } from "@database/datasource";
import { UserSubscription } from "@database/entities/userSubscription.entity";
import { RequestWithUser } from "@interfaces/route.interface";
import UserSubscriptionRepository from "@repositories/userSubscription.repository";
import { userSubscriptionBodySpec } from "@validations/userSubscription.validation";
import { Response } from "express";

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
      const userSubscription = await this.repository.findOneOrThrow(id as string);

      return res.status(200).json({
        error: false,
        data: userSubscription,
      });
    }

    const userSubscriptions = await this.repository.find();

    return res.status(200).json({
      error: false,
      data: userSubscriptions,
    });
  };

  public findMe = async (req: RequestWithUser, res: Response) => {
    const user = req.user;

    const userSubscription = await this.repository.find({
      where: {
        user: {
          id: user!.id,
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

    let userSubscription = await this.repository.findOneOrThrow(req.body.id);

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
