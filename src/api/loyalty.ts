import { honoClient } from "./honoClient";

export type LoyaltyGiftStatus =
  | "pending_selection"
  | "claimable"
  | "redeemed"
  | "expired"
  | "voided";

export interface LoyaltyTierCutoff {
  tierId: number;
  name: string;
  level: number;
  capacity: number;
  startRank: number;
  endRank: number;
  cutoffCount: number | null;
}

export interface LoyaltyCurrentSeason {
  season: {
    seasonId: number;
    name: string;
    startsAt: string;
    endsAt: string;
  } | null;
  tiers?: LoyaltyTierCutoff[];
}

export interface LoyaltyMyRank {
  season: { seasonId: number; name: string; endsAt: string } | null;
  ranked: boolean;
  rank?: number;
  redemptionCount: number;
  tierName?: string | null;
  tiers?: LoyaltyTierCutoff[];
}

export interface LoyaltyGiftOptionMerchant {
  merchantId: number;
  name: string;
}
export interface LoyaltyGiftOption {
  optionId: number;
  label: string;
  description: string | null;
  merchants: LoyaltyGiftOptionMerchant[];
}
export interface LoyaltyGift {
  giftId: number;
  tierName: string;
  status: LoyaltyGiftStatus;
  expiresAt: string | null;
  chosenItemLabel: string | null;
  chosenMerchantName: string | null;
  code: string | null;
  qrToken: string | null;
  redeemedAt: string | null;
  options: LoyaltyGiftOption[];
}

export interface LoyaltyTierPrizes {
  tierId: number;
  name: string;
  level: number;
  capacity: number;
  options: LoyaltyGiftOption[];
}

export interface LoyaltySeasonPrizes {
  season: { seasonId: number; name: string } | null;
  tiers: LoyaltyTierPrizes[];
}

export interface LoyaltyValidateResult {
  found: boolean;
  tierName?: string;
  item?: string | null;
  merchant?: string | null;
  status?: LoyaltyGiftStatus;
  redeemedAt?: string | null;
  expiresAt?: string | null;
}

export interface LoyaltyConsumeResult {
  ok: boolean;
  reason?: string;
  tierName?: string;
  item?: string | null;
  merchant?: string | null;
  redeemedAt?: string | null;
}

export const getCurrentSeason = () =>
  honoClient.get<LoyaltyCurrentSeason>("/loyalty/season/current").then((r) => r.data);

export const getMyRank = () =>
  honoClient.get<LoyaltyMyRank>("/loyalty/leaderboard/me").then((r) => r.data);

export const getMyGifts = () =>
  honoClient
    .get<{ gifts: LoyaltyGift[] }>("/loyalty/gifts/mine")
    .then((r) => r.data.gifts ?? []);

export const getSeasonPrizes = () =>
  honoClient
    .get<LoyaltySeasonPrizes>("/loyalty/season/prizes")
    .then((r) => r.data);

export const selectGift = (giftId: number, optionId: number, merchantId: number) =>
  honoClient
    .post<{ gift: LoyaltyGift }>(`/loyalty/gifts/${giftId}/select`, { optionId, merchantId })
    .then((r) => r.data.gift);

// Public validator (restaurant staff) — token may be a qrToken or a code.
export const validateGift = (token: string) =>
  honoClient
    .get<LoyaltyValidateResult>(`/loyalty/gifts/validate/${encodeURIComponent(token)}`)
    .then((r) => r.data);

export const consumeGift = (token: string) =>
  honoClient
    .post<LoyaltyConsumeResult>("/loyalty/gifts/consume", { token })
    .then((r) => r.data);
