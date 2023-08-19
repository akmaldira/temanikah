export const transactionRequestSpec = (body: any) => ({
  user_id: body.user_id,
  subscription_id: body.subscription_id,
  amount: body.amount,
  voucher_id: body.voucher_id,
});
