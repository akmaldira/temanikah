import { Voucher } from "@/database/entities/voucher.entity";
import { Repository } from "typeorm";

class VoucherRepository extends Repository<Voucher> {}

export default VoucherRepository;
