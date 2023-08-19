import { number, object } from "valibot";

export const TransactionSchema = object({
  subscription_id: number("Paket ID harus number"),
});
