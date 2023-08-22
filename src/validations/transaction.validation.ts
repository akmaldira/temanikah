import { BankType, PaymentType } from "@database/entities/transactions.entity";
import { Enum, enumType, number, object } from "valibot";

const paymentTypeEnum = Object.values(PaymentType) as Enum<PaymentType>;

const bankTypeEnum = Object.values(BankType) as Enum<BankType>;

export const transactionRequestBodySpec = object({
  subscription_id: number("Paket ID harus number"),
  payment_type: enumType(paymentTypeEnum, "Metode pembayaran tidak valid"),
});

export const transactionBankTransferSpec = enumType(
  bankTypeEnum,
  "Bank tidak terdaftar dalam metode pembayaran",
);
