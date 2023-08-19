import { array, number, object, string } from "valibot";

export const subscriptionBodySpec = object({
  name: string("Nama harus string"),
  price: number("Harga harus number"),
  features: array(string("Fitur harus string"), "Fitur harus array"),
  duration: number("Durasi harus number"),
});
