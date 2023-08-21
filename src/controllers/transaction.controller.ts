import { AppDataSource } from "@database/datasource";
import { Subscription } from "@database/entities/subscription.entity";
import { Transaction } from "@database/entities/transactions.entity";
import { Voucher } from "@database/entities/voucher.entity";
import { transactionRequestSpec } from "@dtos/transaction.dto";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import { ITransactionRequest } from "@interfaces/transaction.interface";
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
      relations: ["subscription_id", "user_id", "voucher_id"],
      select: {
        subscription: {
          id: true,
        },
        user: {
          id: true,
        },
        voucher: {
          id: true,
        },
      },
    });

    res.status(200).json({
      error: false,
      data: transactions,
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    const body: ITransactionRequest = this.parseRequestBody(req.body);
    let voucher: null | Voucher = null;
    if (body.voucher_id) {
      voucher = await this.voucherRepository.findOne({
        where: { id: body.voucher_id },
      });
    }
    const subscription = await this.subscriptionRepository.getOrThrow(
      body.subscription_id,
    );

    this.checkIfVoucherCanApply(voucher, subscription);
    console.log(uuidv4());

    const totalAmount = this.totalAmount(subscription.price, voucher);
    const transaction = this.repository.create({
      ...body,
      id: uuidv4(),
      user: req.user!,
      subscription: subscription,
      amount: totalAmount,
      voucher: voucher ?? undefined,
    });

    await this.createMidtransTransaction(transaction);

    res.status(201).json({
      error: false,
      data: transaction,
    });
  };

  // Todo: Implement this
  // public notification = async (req: Request, res: Response) => {};

  private parseRequestBody = (body: any): ITransactionRequest => {
    TransactionSchema.parse(body);
    return transactionRequestSpec(body);
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
}

export default TransactionController;
