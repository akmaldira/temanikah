import { AppDataSource } from "@database/datasource";
import { Subscription } from "@database/entities/subscription.entity";
import { Transaction, TransactionStatus } from "@database/entities/transactions.entity";
import { Voucher } from "@database/entities/voucher.entity";
import { transactionResponseSpec } from "@dtos/transaction.dto";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import SubscriptionRepository from "@repositories/subscription.repository";
import TransactionRepository from "@repositories/transaction.repository";
import VoucherRepository from "@repositories/voucher.repository";
import { TransactionSchema } from "@validations/transaction.validation";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
const midtransClient = require("midtrans-client");

class TransactionController {
  private repository: TransactionRepository;
  private voucherRepository: VoucherRepository;
  private subscriptionRepository: SubscriptionRepository;
  constructor() {
    this.repository = new TransactionRepository(
      Transaction,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.voucherRepository = new VoucherRepository(
      Voucher,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
    this.subscriptionRepository = new SubscriptionRepository(
      Subscription,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: RequestWithUser, res: Response) => {
    const transactions = await this.repository.find({
      relations: ["subscription", "user", "voucher"],
    });

    res.status(200).json({
      error: false,
      data: transactions.map(transaction => transactionResponseSpec(transaction)),
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    TransactionSchema.parse(req.body);

    let voucher: null | Voucher = null;
    if (req.body.voucher_code) {
      voucher = await this.voucherRepository.findOne({
        where: { code: req.body.voucher_code },
      });
    }
    const subscription = await this.subscriptionRepository.getOrThrow(
      req.body.subscription_id,
    );

    this.checkIfVoucherCanApply(voucher, subscription);

    const totalAmount = this.totalAmount(subscription.price, voucher);
    const transaction = this.repository.create({
      id: uuidv4(),
      user: req.user!,
      subscription: subscription,
      amount: totalAmount,
      voucher: voucher ?? undefined,
    });

    await this.createMidtransTransaction(transaction);

    if (transaction.voucher) {
      transaction.voucher.stock -= 1;
      await this.voucherRepository.save(transaction.voucher);
    }

    res.status(201).json({
      error: false,
      data: transactionResponseSpec(transaction),
    });
  };

  public notification = async (req: Request, res: Response) => {
    const notification = await this.handleNotification(req.body);

    const { order_id, transaction_status, fraud_status } = notification;
    if (!order_id || !transaction_status || !fraud_status) {
      throw new HttpException(400, "Invalid notification body", "INVALID_BODY");
    }
    const transaction = await this.repository.findOne({ where: { id: order_id } });

    if (!transaction) {
      throw new HttpException(400, "Transaction not found", "TRANSACTION_NOT_FOUND");
    }

    if (transaction_status == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraud_status == "challenge") {
        // TODO set transaction status on your databaase to 'challenge'
      } else if (fraud_status == "accept") {
        // TODO set transaction status on your databaase to 'success'
      }
    } else if (transaction_status == "settlement") {
      transaction.status = TransactionStatus.success;
    } else if (transaction_status == "deny") {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transaction_status == "cancel" || transaction_status == "expire") {
      transaction.status = TransactionStatus.declined;
    } else if (transaction_status == "pending") {
      transaction.status = TransactionStatus.pending;
      // TODO set transaction status on your databaase to 'pending' / waiting payment
    }

    transaction.midtrans_response.push(JSON.stringify(notification));

    await this.repository.save(transaction);

    res.status(200).json(transaction);
  };

  private checkIfVoucherCanApply = (
    voucher: null | Voucher,
    subscription: Subscription,
  ): void => {
    if (voucher) {
      if (voucher.stock === 0) {
        throw new HttpException(400, "Voucher sudah habis", "VOUCHER_EMPTY");
      }

      if (voucher.expired_at < new Date()) {
        throw new HttpException(400, "Voucher sudah expired", "VOUCHER_EXPIRED");
      }

      if (voucher.min_price > subscription.price || !voucher.is_active) {
        throw new HttpException(
          400,
          "Voucher tidak dapat digunakan",
          "VOUCHER_NOT_APPLICABLE",
        );
      }
    }
  };

  private totalAmount = (amount: number, voucher: null | Voucher): number => {
    if (voucher) {
      return amount - voucher.discount;
    }
    return amount;
  };

  private createMidtransTransaction = async (transaction: Transaction): Promise<void> => {
    const coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const parameter = {
      payment_type: "bank_transfer",
      bank_transfer: {
        bank: "permata",
        permata: {
          user_id: transaction.user,
        },
      },
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.amount,
      },
    };

    coreApi
      .charge(parameter)
      .then(async (chargeResponse: any) => {
        transaction.midtrans_response = [JSON.stringify(chargeResponse)];

        await this.repository.save(transaction);
      })
      .catch((e: any) => {
        throw new HttpException(400, e.message, "MIDTRANS_ERROR");
      });
  };

  private handleNotification = async (body: any): Promise<any> => {
    const apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    return await apiClient.transaction.notification(body);
  };
}

export default TransactionController;
