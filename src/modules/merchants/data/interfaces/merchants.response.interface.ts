import type { IMerchant } from "@/data/interfaces/merchant.interface";

export interface MerchantResponse {
  message: string;
  merchant: IMerchant;
}

export interface AllMerchantsResponse {
  merchants: IMerchant[];
  count: number;
}
