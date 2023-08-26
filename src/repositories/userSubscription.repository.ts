import { UserSubscription } from "@database/entities/userSubscription.entity";
import { Repository } from "typeorm";

class UserSubscriptionRepository extends Repository<UserSubscription> {}

export default UserSubscriptionRepository;
