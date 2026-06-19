import { BrandBookColors } from "./palette";

/**
 * Offer benefit types. Values MUST match the backend DB enum
 * (`OfferType` in offer.entity.ts) exactly — the /branches/filter endpoint
 * validates `offerTypes` against these lowercase values.
 */
export const OFFER_TYPES = [
  { value: "percentage", label: "% Descuento", color: BrandBookColors.blue },
  { value: "fixed_amount", label: "Monto fijo", color: BrandBookColors.orange },
  { value: "promo", label: "Promoción", color: BrandBookColors.pink },
] as const;

export const OFFER_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  OFFER_TYPES.map((t) => [t.value, t.label]),
);

export const OFFER_TYPE_COLORS: Record<string, string> = Object.fromEntries(
  OFFER_TYPES.map((t) => [t.value, t.color]),
);

/**
 * The offer's headline value, formatted by type (mirrors the Flutter app's
 * `offerTypeValue`): a percentage, a COP amount, or the raw promo text.
 */
export function formatOfferValue(offer: { offerType: string; value: string }): string {
  const raw = (offer.value ?? "").trim();
  if (!raw) return OFFER_TYPE_LABELS[offer.offerType] ?? "Beneficio";

  const numeric = Number(raw.replace(/[^\d.]/g, ""));
  if (offer.offerType === "percentage") {
    return Number.isFinite(numeric) && numeric > 0 ? `${numeric}%` : raw;
  }
  if (offer.offerType === "fixed_amount") {
    return Number.isFinite(numeric) && numeric > 0
      ? `$${numeric.toLocaleString("es-CO")}`
      : raw;
  }
  // promo (or unknown) — show the value as authored.
  return raw;
}
