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

// deliveryPin (opt-in): sends the chosen delivery location so the backend
// re-validates hours + coverage at generate time (409 with a clear message if
// the branch closed or the pin moved out of zone while browsing). address is
// stored on the code's delivery_use_info row.
export const generateDeliveryCode = (
  branchId: number,
  deliveryPin?: { lat: number; lng: number; address?: string } | null,
) =>
  honoClient.post<DeliveryCodeResponse>("/redemptions/codes/generate", {
    branchId,
    requestType: "delivery",
    ...(deliveryPin
      ? {
          deliveryLat: deliveryPin.lat,
          deliveryLng: deliveryPin.lng,
          ...(deliveryPin.address ? { address: deliveryPin.address } : {}),
        }
      : {}),
  });

export const getMyRedemptions = () =>
  honoClient.get<{ redemptions: Redemption[] }>("/redemptions/by-me");
