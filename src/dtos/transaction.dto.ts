import { Transaction } from "@database/entities/transactions.entity";

export const transactionResponseSpec = (transaction: Transaction) => ({
  created_at: transaction.created_at,
  amount: transaction.amount,
  status: transaction.status,
  subscription_name: transaction.subscription.name,
  user_email: transaction.user.email,
  voucher_code: transaction.voucher?.code,
});
