import { honoClient } from "./honoClient";
import type { GeneratedCode, Redemption } from "@/types";

export const verifyCode = (code: string, totalPaid?: number) =>
  honoClient.post("/redemptions/codes/verify", {
    code,
    ...(totalPaid !== undefined ? { totalPaid } : {}),
  });

export const generateCode = (branchId: number) =>
  honoClient.post<GeneratedCode>("/redemptions/codes/generate", { branchId });

// Delivery variant: the response also carries the branch's delivery contact so
// the delivery page can render the right CTA (WhatsApp / phone / webpage).
export interface DeliveryCodeResponse {
  code: string;
  delivery?: {
    contactType: "whatsapp" | "phone" | "both" | "webpage" | null;
    whatsapp: string | null;
    phone: string | null;
    contactMessage: string;
    webpageUrl: string | null;
    instructions: string | null;
  };
}

export const generateDeliveryCode = (branchId: number) =>
  honoClient.post<DeliveryCodeResponse>("/redemptions/codes/generate", {
    branchId,
    requestType: "delivery",
  });

export const getMyRedemptions = () =>
  honoClient.get<{ redemptions: Redemption[] }>("/redemptions/by-me");
