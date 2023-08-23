import { AppDataSource } from "@database/datasource";
import { Voucher } from "@database/entities/voucher.entity";
import { HttpException } from "@exceptions/http.exception";
import { RequestWithUser } from "@interfaces/route.interface";
import VoucherRepository from "@repositories/voucher.repository";
import { voucherBodySpec } from "@validations/voucher.validation";
import { Response } from "express";

class VoucherController {
  private repository: VoucherRepository;

  constructor() {
    this.repository = new VoucherRepository(
      Voucher,
      AppDataSource.manager,
      AppDataSource.manager.queryRunner,
    );
  }

  public findAll = async (req: RequestWithUser, res: Response) => {
    const vouchers = await this.repository.find();

    res.status(200).json({
      error: false,
      data: vouchers,
    });
  };

  public create = async (req: RequestWithUser, res: Response) => {
    voucherBodySpec.parse(req.body);

    const voucher = await this.repository.save(req.body as Voucher);

    res.status(201).json({
      error: false,
      data: voucher,
    });
  };

  public delete = async (req: RequestWithUser, res: Response) => {
    if (req.query.id === undefined) {
      throw new HttpException(400, "ID tidak boleh kosong", "ID_REQUIRED");
    }

    await this.repository.softDelete(Number(req.query.id));

    res.status(200).json({
      error: false,
      data: "Berhasil menghapus vocher",
    });
  };
}

export default VoucherController;
