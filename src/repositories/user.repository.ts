import { AppDataSource } from "@database/datasource";
import { UserEntity } from "@database/entities/user.entity";
import { Repository } from "typeorm";

class UserRepository {
  private datasource: Repository<UserEntity>;
  constructor() {
    this.datasource = AppDataSource.getRepository(UserEntity);
  }

  public async create(user: UserEntity): Promise<UserEntity> {
    return await this.datasource.save(user);
  }
  public async update(user: UserEntity): Promise<UserEntity> {
    return await this.datasource.save(user);
  }
  public async delete(id: string): Promise<void> {
    await this.datasource.delete(id);
  }
  public async getById(id: string): Promise<UserEntity | null> {
    return await this.datasource.findOne({ where: { id } });
  }
  public async getAll(): Promise<UserEntity[]> {
    return await this.datasource.find();
  }
  public async getByEmail(email: string): Promise<UserEntity | null> {
    return await this.datasource.findOne({ where: { email } });
  }
}

export default UserRepository;
