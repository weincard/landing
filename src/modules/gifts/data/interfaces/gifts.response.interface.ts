import type { IGift } from "@/data/interfaces/gift.interface";

export interface GiftResponse {
  message: string;
  gift: IGift;
}

export interface AllGiftsResponse {
  message: string;
  count: number;
  gifts: IGift[];
}
