import { BankType, Transaction } from "@database/entities/transactions.entity";
import { IUser } from "@interfaces/user.interface";

const midtransClient = require("midtrans-client");

class MidtransPayment {
  private coreApi: any;

  constructor() {
    this.coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  public bankTransfer = async (
    user: IUser,
    transaction: Transaction,
    bankType: BankType,
  ) => {
    const parameter = {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: bankType,
        va_number: "12345678901",
      },
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.amount,
      },
      costumer_details: {
        email: user.email,
      },
    };

    const tx = await this.coreApi.charge(parameter);
    let va_number;

    if (bankType == "permata") {
      va_number = tx.permata_va_number;
    } else if (bankType == "bca" || bankType == "bri" || bankType == "bni") {
      va_number = tx.va_numbers[0].va_number;
    }

    return {
      ...tx,
      va_number,
    };
  };

  public qris = async (user: IUser, transaction: Transaction) => {
    const parameter = {
      payment_type: "qris",
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.amount,
      },
      costumer_details: {
        email: user.email,
      },
    };

    const tx = await this.coreApi.charge(parameter);

    return {
      ...tx,
      va_number: tx.qr_string,
    };
  };

  public static notification = async (body: any) => {
    const apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
    return await apiClient.transaction.notification(body);
  };
}

export default MidtransPayment;
