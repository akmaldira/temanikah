import { Subscription } from "@database/entities/subscription.entity";
import { HttpException } from "@exceptions/http.exception";
import { Repository } from "typeorm";

class SubscriptionRepository extends Repository<Subscription> {
  public async findOneOrThrow(id: number): Promise<Subscription> {
    const subscription = await this.findOne({ where: { id } });
    if (!subscription) {
      throw new HttpException(400, "Paket tidak ditemukan", "SUBSCRIPTION_NOT_FOUND");
    }
    return subscription;
  }

  public async updateAndReturn(
    id: number,
    subscription: Subscription,
  ): Promise<Subscription> {
    await this.update(id, subscription);
    return await this.findOneOrThrow(id);
  }
}

export default SubscriptionRepository;
