import { Transaction } from "@database/entities/transactions.entity";
import { HttpException } from "@exceptions/http.exception";
import { FindOneOptions, Repository } from "typeorm";

class TransactionRepository extends Repository<Transaction> {
  public async findOneOrThrow(args: FindOneOptions<Transaction>): Promise<Transaction> {
    const transaction = await this.findOne(args);
    if (!transaction) {
      throw new HttpException(404, "Transaksi tidak ditemukan", "TRANSACTION_NOT_FOUND");
    }
    return transaction;
  }
}

export default TransactionRepository;
