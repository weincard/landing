import { honoClient } from "./honoClient";

export const redeemCoupon = (code: string) =>
  honoClient.post("/coupons/redeem", { code: code.trim().toUpperCase() });
