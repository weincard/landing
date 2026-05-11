import { apiClient } from "./client";

export const verifyCode = (code: string, totalPaid?: number) =>
  apiClient.post("/redemptions/codes/verify", {
    code,
    ...(totalPaid !== undefined ? { totalPaid } : {}),
  });
