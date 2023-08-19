import { number, object, string } from "valibot";

export const voucherBodySpec = object({
  name: string("Nama harus string"),
  code: string("Kode harus string"),
  discount: number("Diskon harus number"),
  min_price: number("Minimal harga harus number"),
  stock: number("Stok harus number"),
  expired_at: string("Tanggal kadaluarsa harus string"),
});
