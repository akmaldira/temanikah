import { Transaction } from "@database/entities/transactions.entity";
import { Repository } from "typeorm";

class TransactionRepository extends Repository<Transaction> {}

export default TransactionRepository;
