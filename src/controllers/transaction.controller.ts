import { AppDataSource } from "@database/datasource";
import { Subscription } from "@database/entities/subscription.entity";
import {
  BankType,
  Transaction,
  TransactionStatus,
} from "@database/entities/transactions.entity";
import { UserSubscription } from "@database/entities/userSubscription.entity";
import { Voucher } from "@database/entities/voucher.entity";
import { transactionResponseSpec } from "@dtos/transaction.dto";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import SubscriptionRepository from "@repositories/subscription.repository";
import TransactionRepository from "@repositories/transaction.repository";
import UserSubscriptionRepository from "@repositories/userSubscription.repository";
import VoucherRepository from "@repositories/voucher.repository";
import {
  transactionBankTransferSpec,
  transactionRequestBodySpec,
} from "@validations/transaction.validation";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import MidtransPayment from "./payments/midtrans";

class TransactionController {
  private repository: TransactionRepository;
  private voucherRepository: VoucherRepository;
  private subscriptionRepository: SubscriptionRepository;
  private userSubscriptionRepository: UserSubscriptionRepository;
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
    this.userSubscriptionRepository = new UserSubscriptionRepository(
      UserSubscription,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: RequestWithUser, res: Response) => {
    const { id, skip, take } = req.query;

    if (id) {
      const transaction = await this.repository.findOneOrThrow({
        relations: ["subscription", "user", "voucher"],
        where: {
          id: id as string,
        },
      });

      return res.status(200).json({
        error: false,
        data: transactionResponseSpec(transaction),
      });
    }

    const transactions = await this.repository.find({
      relations: ["subscription", "user", "voucher"],
      where: {
        user: {
          id: req.user!.id,
        },
      },
      order: {
        created_at: "DESC",
      },
      skip: Number(skip) ?? 0,
      take: Number(take) ?? 10,
    });

    res.status(200).json({
      error: false,
      data: transactions.map(transaction => transactionResponseSpec(transaction)),
    });
  };

  public findByUserId = async (req: RequestWithUser, res: Response) => {
    const { user_id } = req.params;
    const { id, skip, take } = req.query;

    if (!user_id)
      throw new HttpException(400, "User id tidak ditemukan", "USER_ID_NOT_FOUND");

    if (id) {
      const transaction = await this.repository.findOneOrThrow({
        relations: ["subscription", "user", "voucher"],
        where: {
          user: {
            id: user_id,
          },
          id: id as string,
        },
      });

      return res.status(200).json({
        error: false,
        data: transactionResponseSpec(transaction),
      });
    }

    const transactions = await this.repository.find({
      relations: ["subscription", "user", "voucher"],
      where: {
        user: {
          id: user_id,
        },
      },
      order: {
        created_at: "DESC",
      },
      skip: Number(skip) ?? 0,
      take: Number(take) ?? 10,
    });

    res.status(200).json({
      error: false,
      data: transactions.map(transaction => transactionResponseSpec(transaction)),
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    transactionRequestBodySpec.parse(req.body);

    let voucher: null | Voucher = null;
    if (req.body.voucher_code) {
      voucher = await this.voucherRepository.findOneOrThrow(req.body.voucher_code);
    }
    const subscription = await this.subscriptionRepository.findOneOrThrow(
      req.body.subscription_id,
    );

    this.checkIfVoucherCanApply(voucher, subscription);

    const paymentType = req.body.payment_type;
    const totalAmount = this.totalAmount(subscription.price, voucher);
    const transaction = this.repository.create({
      id: uuidv4(),
      user: req.user!,
      subscription: subscription,
      amount: totalAmount,
      payment_type: paymentType,
      voucher: voucher ?? undefined,
    });

    const midtrans = new MidtransPayment();
    if (paymentType == "bank_transfer") {
      const bankType = req.body.bank;
      transactionBankTransferSpec.parse(bankType);
      const createTx = await midtrans.bankTransfer(req.user!, transaction, bankType);
      transaction.va_number = createTx.va_number;
      transaction.midtrans_response = [JSON.stringify(createTx)];
      transaction.payment_name = bankType;
    } else if (paymentType == "qris") {
      const createTx = await midtrans.qris(req.user!, transaction);
      transaction.va_number = createTx.va_number;
      transaction.midtrans_response = [JSON.stringify(createTx)];
      transaction.payment_name = "qris" as BankType;
    } else {
      throw new HttpException(400, "Metode pembayaran tidak valid", "PAYMENT_NOT_VALID");
    }
    await this.repository.save(transaction);

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
    const notification = await MidtransPayment.notification(req.body);

    const { order_id, transaction_status, fraud_status } = notification;

    const transaction = await this.repository.findOne({
      where: { id: order_id },
      relations: ["user"],
    });

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
      await this.userSubscriptionRepository.save({
        transaction: transaction,
        user: transaction.user,
      });
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
}

export default TransactionController;
