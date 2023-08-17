import { SECRET_KEY } from "@config";
import { UserRole } from "@database/entities/user.entity";
import { HttpException } from "@exceptions/http.exception";
import { NextFunction, Request } from "express";
import { verify } from "jsonwebtoken";

const hasRole = (roles: UserRole[]) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization =
      req.cookies["Authorization"] ||
      (req.header("Authorization")
        ? req.header("Authorization")!.split("Bearer ")[1]
        : null);

    if (!authorization) next(new HttpException(401, "Token tidak ditemukan"));

    const secretKey: string = SECRET_KEY!;
    verify(authorization, secretKey, (err: any, userToken: any) => {
      if (err) next(new HttpException(401, "Token autentikasi salah"));

      if (!roles.some((r) => userToken.role.includes(r)))
        next(
          new HttpException(403, "Anda tidak memiliki akses untuk fitur ini")
        );

      req.user = userToken;
      next();
    });
  } catch (error) {
    next(new HttpException(401, "Token autentikasi salah"));
  }
};

export default hasRole;
