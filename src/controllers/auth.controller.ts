import { SECRET_KEY } from "@config";
import { UserEntity } from "@database/entities/user.entity";
import { registerRequestSpec, registerResponseSpec } from "@dtos/auth.dto";
import { HttpException } from "@exceptions/http.exception";
import { LoginRequest, RegisterRequest } from "@interfaces/auth.interface";
import UserRepository from "@repositories/user.repository";
import { LoginRegisterSchema } from "@validations/auth.validation";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

class AuthController {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  public login = async (req: Request, res: Response) => {
    const body: LoginRequest = this.parseRequestBody(req.body);

    const user = await this.userRepository.getByEmail(body.email);

    this.checkIfUserExists(user);

    const isPasswordMatch: boolean = await this.checkIfPasswordMatch(
      body.password,
      user!.password
    );

    if (!isPasswordMatch) {
      throw new HttpException(400, "Email atau password salah");
    }

    const token = await this.generateToken(user!);

    res.status(200).json({
      error: false,
      data: { id: user?.id, role: user?.role, token },
    });
  };

  public register = async (req: Request, res: Response) => {
    const body: RegisterRequest = this.parseRequestBody(req.body);

    this.checkIfUserNotExists(await this.userRepository.getByEmail(body.email));

    body.password = await this.hashPassword(body.password);

    const user = await this.userRepository.create(body as UserEntity);

    res.status(201).json({
      error: false,
      data: registerResponseSpec(user),
    });
  };

  private parseRequestBody = (body: any): RegisterRequest => {
    LoginRegisterSchema.parse(body);
    return registerRequestSpec(body);
  };

  private checkIfUserNotExists = (user: UserEntity | null): void => {
    if (user) {
      throw new HttpException(400, "Email telah terdaftar");
    }
  };

  private checkIfUserExists = (user: UserEntity | null): void => {
    if (!user) {
      throw new HttpException(400, "Email tidak terdaftar");
    }
  };

  private hashPassword = async (password: string): Promise<string> => {
    return await hash(password, 10);
  };

  private checkIfPasswordMatch = async (
    bodyPassword: string,
    userPassword: string
  ): Promise<boolean> => {
    return await compare(bodyPassword, userPassword);
  };

  private generateToken = async (user: UserEntity): Promise<string> => {
    const dataStoredInToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const secretKey: string = SECRET_KEY!;
    const expiresIn: number = 60 * 60 * 24 * 7;
    return sign(dataStoredInToken, secretKey, { expiresIn });
  };
}

export default AuthController;
