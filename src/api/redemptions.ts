import { honoClient } from "./honoClient";
import type { GeneratedCode, Redemption } from "@/types";

export const verifyCode = (code: string, totalPaid?: number) =>
  honoClient.post("/redemptions/codes/verify", {
    code,
    ...(totalPaid !== undefined ? { totalPaid } : {}),
  });

export const generateCode = (branchId: number) =>
  honoClient.post<GeneratedCode>("/redemptions/codes/generate", { branchId });

export const getMyRedemptions = () =>
  honoClient.get<{ redemptions: Redemption[] }>("/redemptions/by-me");
