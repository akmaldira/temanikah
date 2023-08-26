import { AppDataSource } from "@database/datasource";
import { Subscription } from "@database/entities/subscription.entity";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import SubscriptionRepository from "@repositories/subscription.repository";
import { subscriptionBodySpec } from "@validations/subscription.validation";
import { Response } from "express";

class SubscriptionController {
  private repository: SubscriptionRepository;

  constructor() {
    this.repository = new SubscriptionRepository(
      Subscription,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: RequestWithUser, res: Response) => {
    const user = req.user;

    let subscriptions: Subscription[] = [];

    if (user && user.role === "admin") {
      subscriptions = await this.repository.find();
    } else {
      subscriptions = await this.repository.find({
        where: {
          is_visible: true,
        },
        order: {
          id: "ASC",
        },
      });
    }

    res.status(200).json({
      error: false,
      data: subscriptions,
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    subscriptionBodySpec.parse(req.body);

    const subscription = await this.repository.save(req.body as Subscription);

    res.status(201).json({
      error: false,
      data: subscription,
    });
  };

  public update = async (req: RequestWithUser, res: Response) => {
    subscriptionBodySpec.parse(req.body);

    if (req.body.id === undefined) {
      throw new HttpException(400, "ID tidak boleh kosong", "ID_REQUIRED");
    }

    const subscription = await this.repository.updateAndReturn(
      req.body.id,
      req.body as Subscription,
    );

    res.status(200).json({
      error: false,
      data: subscription,
    });
  };

  public delete = async (req: RequestWithUser, res: Response) => {
    if (req.query.id === undefined) {
      throw new HttpException(400, "ID tidak boleh kosong", "ID_REQUIRED");
    }

    await this.repository.softDelete(Number(req.query.id));

    res.status(200).json({
      error: false,
      message: "Berhasil menghapus paket",
    });
  };
}

export default SubscriptionController;
