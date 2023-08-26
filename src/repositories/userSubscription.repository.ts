import { HttpException } from "@/exceptions/http.exception";
import { UserSubscription } from "@database/entities/userSubscription.entity";
import { Repository } from "typeorm";

class UserSubscriptionRepository extends Repository<UserSubscription> {
  public async findOneOrThrow(id: string) {
    const userSubscription = await this.findOne({
      where: { id },
    });

    if (!userSubscription) {
      throw new HttpException(
        400,
        "User subscription not found",
        "USER_SUBSCRIPTION_NOT_FOUND",
      );
    }

    return userSubscription;
  }
}

export default UserSubscriptionRepository;
