import { HttpException } from "@/exceptions/http.exception";
import { UserSubscription } from "@database/entities/userSubscription.entity";
import { FindOneOptions, Repository } from "typeorm";

class UserSubscriptionRepository extends Repository<UserSubscription> {
  public async findOneOrThrow(args: FindOneOptions<UserSubscription>) {
    const userSubscription = await this.findOne(args);

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
