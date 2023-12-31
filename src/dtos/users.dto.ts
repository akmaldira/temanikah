import { User } from "@database/entities/user.entity";

export const userResponseSpec = (user: User) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  is_verified: user.is_verified,
  is_banned: user.is_banned,
  banned_reason: user.banned_reason,
  banned_at: user.banned_at,
  created_at: user.created_at,
});
