import { apiClient } from "./client";
import type { GeneratedCode, Redemption } from "@/types";

export const verifyCode = (code: string, totalPaid?: number) =>
  apiClient.post("/redemptions/codes/verify", {
    code,
    ...(totalPaid !== undefined ? { totalPaid } : {}),
  });

export const generateCode = (offerId: number) =>
  apiClient.post<GeneratedCode>("/redemptions/codes/generate", { offerId });

export const getMyRedemptions = () =>
  apiClient.get<{ redemptions: Redemption[] }>("/redemptions/by-me");
