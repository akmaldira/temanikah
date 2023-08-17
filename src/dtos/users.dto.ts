import { UserEntity } from "@/database/entities/user.entity";

export const userResponseSpec = (users: UserEntity[]) => {
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  }));
};
