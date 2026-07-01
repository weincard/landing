import { honoClient } from "./honoClient";

// La Plaza de Wein — types mirror the hono `plaza` service entities. We only
// consume the PUBLIC, read-only endpoint here; everything is display-only.

/** A benefit shown for the feria (edition-wide) or overridden per merchant. */
export interface PlazaOffer {
  title: string;
  description?: string;
  value?: string;
  conditions?: string;
  offerType?: string;
}

/** A category filter chip. `key` matches PlazaMerchant.category. */
export interface PlazaEditionCategory {
  key: string;
  label: string;
}

export interface PlazaEditionConfig {
  searchSuggestions?: string[];
  categories?: PlazaEditionCategory[];
  accentColor?: string;
  intro?: string;
}

export interface PlazaEdition {
  plazaEditionId: number;
  name: string;
  slug: string | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  venueName: string | null;
  venueAddress: string | null;
  venueLatitude: number | null;
  venueLongitude: number | null;
  heroImageUrl: string | null;
  coverImageUrl: string | null;
  config: PlazaEditionConfig;
  /** Shared benefit for every merchant in this feria. Display-only. */
  offers: PlazaOffer[];
  createdAt: string;
}

export interface PlazaMerchant {
  plazaMerchantId: number;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  images: string[];
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  /** Non-empty replaces the edition's shared benefit for this merchant. */
  offers: PlazaOffer[];
  createdAt: string;
}

export interface PlazaActive {
  edition: PlazaEdition | null;
  merchants: PlazaMerchant[];
}

// GET /plaza/public/active is PUBLIC (no JWT). Returns the live edition + its
// active merchants, or { edition: null, merchants: [] } when no feria is live.
export const getPlazaActive = () =>
  honoClient.get<PlazaActive>("/plaza/public/active");

// ── Plaza redemptions (QR verify) ──────────────────────────────────────────

export interface PlazaVerifyRedemption {
  code: string;
  active: boolean;
  verified: boolean;
  verifiedAt: string | null;
  user: { name: string | null; phone: string | null } | null;
  merchant: { plazaMerchantId: number; name: string } | null;
  edition: { plazaEditionId: number; name: string } | null;
}

export interface PlazaVerifyResponse {
  message: string;
  alreadyVerified?: boolean;
  expired?: boolean;
  redemption?: PlazaVerifyRedemption;
}

// POST /plaza/redemptions/verify is PUBLIC (the stand opens the QR link). It
// auto-completes the redemption when the user is active.
export const verifyPlazaCode = (code: string) =>
  honoClient.post<PlazaVerifyResponse>("/plaza/redemptions/verify", { code });

export interface PlazaGenerateResponse {
  /** One-time bearer token embedded in the verification URL/QR. */
  code: string;
  /** ISO expiry (short TTL) or null. */
  expiresAt: string | null;
  plazaMerchantId: number;
}

// POST /plaza/redemptions/generate (requireAuth — active member). Mints a
// one-time code for the member to present as a QR at the given stand. The stand
// opens `${origin}/plaza/verificacion?code=...` to verify + record the redemption.
export const generatePlazaRedemption = (plazaMerchantId: number) =>
  honoClient.post<PlazaGenerateResponse>("/plaza/redemptions/generate", {
    plazaMerchantId,
  });
