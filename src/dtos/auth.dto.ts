import { UserEntity } from "@/database/entities/user.entity";
import { RegisterRequest } from "@/interfaces/auth.interface";

export const registerRequestSpec = (body: any): RegisterRequest => ({
  email: body.email,
  password: body.password,
});

export const registerResponseSpec = (user: UserEntity) => ({
  id: user.id,
  email: user.email,
  created_at: user.created_at,
});
