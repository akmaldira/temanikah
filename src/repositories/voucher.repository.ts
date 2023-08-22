import { Voucher } from "@database/entities/voucher.entity";
import { HttpException } from "@exceptions/http.exception";
import { Repository } from "typeorm";

class VoucherRepository extends Repository<Voucher> {
  public findOneOrThrow = async (code: string) => {
    const voucher = await this.findOne({ where: { code } });
    if (!voucher) {
      throw new HttpException(400, "Voucher tidak valid", "VOUCHER_NOT_VALID");
    }
    return voucher;
  };
}

export default VoucherRepository;
