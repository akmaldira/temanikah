import { Transaction } from "@database/entities/transactions.entity";
import { HttpException } from "@exceptions/http.exception";
import { Repository } from "typeorm";

class TransactionRepository extends Repository<Transaction> {
  public async findOneOrThrow(id: string): Promise<Transaction> {
    const transaction = await this.findOne({
      relations: ["subscription", "user", "voucher"],
      where: { id },
    });
    if (!transaction) {
      throw new HttpException(400, "Transaksi tidak ditemukan", "TRANSACTION_NOT_FOUND");
    }
    return transaction;
  }
}

export default TransactionRepository;
