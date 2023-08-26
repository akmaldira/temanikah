import { object, string } from "valibot";

export const userSubscriptionBodySpec = object({
  id: string("id harus string"),
});
