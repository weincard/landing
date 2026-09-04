import { honoClient } from "./honoClient";
import type { Branch } from "@/types";
import type { Coords } from "@/lib/location";

// The "Domicilios" (delivery) merchant category is special: Flutter lists it via
// GET /deliveries/branches (public) — branches that offer the delivery channel
// and have an active delivery_config — NOT /branches/tiles. Geo-sorted by ?lat&lng.

export interface DeliveryBranch {
  branchId: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  logoUrl: string;
  coverImageUrl: string | null;
  /** Branch (food) category — the Domicilios chips derive from these. */
  categoryId: number | null;
  categoryName: string | null;
  delivery: {
    contactType: string | null;
    whatsapp: string | null;
    phone: string | null;
    contactMessage: string;
    /** contactType 'webpage': the ally takes orders on this URL (null on
     *  /deliveries/search — Typesense docs don't carry it). */
    webpageUrl: string | null;
    /** Optional guidance text shown to the user in the delivery flow. */
    instructions: string | null;
    deliveryFee: number | string | null;
    minimumOrder: number | string | null;
    estimatedTime: string | null;
    /** Additive (deliveries v2): 'contact' | 'partner'. */
    fulfillmentMode?: string | null;
    /** Additive: computed from the branch's delivery hours (Bogotá). */
    openNow?: boolean;
    /** Additive (Phase B): structured Armi ordering is live for this branch. */
    partnerEnabled?: boolean;
  };
  offers: {
    offerId: number;
    title: string;
    offerType: string;
    validDays: string[] | null;
    membershipPlanId: number | null;
    membershipPlanLevel: number | null;
  }[];
}

export interface DeliveryBranchesParams {
  q?: string;
  /** Branch (food) category — the category chips. Both endpoints accept it. */
  categoryId?: number;
  /** Only branches with a delivery-eligible offer valid on ANY of these days. */
  validDays?: string[];
  /** The chosen delivery pin. Opt-in: when sent, the backend HIDES branches
   *  that are out of coverage or closed right now. */
  deliveryPin?: { lat: number; lng: number } | null;
}

export const getDeliveryBranches = (
  coords: Coords,
  { q, categoryId, validDays, deliveryPin }: DeliveryBranchesParams = {},
) => {
  // With a search text, use the Typesense-backed GET /deliveries/search
  // (matches branch/offer text + merchant tags, typo/accent tolerant).
  // Without one, keep the DB-backed listing. Both accept the same filters.
  const query = q?.trim();
  const qs = new URLSearchParams();
  if (query) qs.set("q", query);
  qs.set("lat", String(coords.lat));
  qs.set("lng", String(coords.lng));
  if (categoryId) qs.set("categoryId", String(categoryId));
  if (validDays?.length) qs.set("validDays", validDays.join(","));
  if (deliveryPin) {
    qs.set("deliveryLat", String(deliveryPin.lat));
    qs.set("deliveryLng", String(deliveryPin.lng));
  }
  const path = `${query ? "/deliveries/search" : "/deliveries/branches"}?${qs.toString()}`;
  return honoClient.get<{ data: DeliveryBranch[]; count: number }>(path);
};

// ─── Branch catalog (browse-only menu) ──────────────────────────────────────

// Catalog v2 — modifier groups. minSelect=maxSelect=1 → required choice
// (radio); otherwise optional add-ons (checkboxes, maxSelect distinct).
export interface CatalogModifierOption {
  modifierOptionId: number;
  name: string;
  priceDelta: number;
  /** false = "Agotado" at this branch. */
  isAvailable: boolean;
}

export interface CatalogModifierGroup {
  modifierGroupId: number;
  name: string;
  minSelect: number;
  maxSelect: number;
  options: CatalogModifierOption[];
}

export interface CatalogItem {
  masterProductId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  isAvailable: boolean;
  modifierGroups?: CatalogModifierGroup[];
}

export interface BranchCatalog {
  branchId: number;
  /** false = the branch is outside its delivery hours right now. */
  openNow: boolean;
  /** null when no pin was sent; false = the pin is out of coverage. */
  inCoverage: boolean | null;
  fulfillmentMode: string | null;
  /** Phase B: true = cart/checkout flow; false = contact hand-off flow. */
  partnerEnabled?: boolean;
  minimumOrder?: number | null;
  armiCity?: string | null;
  sections: { name: string; items: CatalogItem[] }[];
  // Member discount preview (same engine as checkout) / non-member upsell.
  discount?: { pct: number; title: string } | null;
  upsellPct?: number | null;
}

export const getBranchCatalog = (
  branchId: number,
  deliveryPin?: { lat: number; lng: number } | null,
) => {
  const qs = new URLSearchParams();
  if (deliveryPin) {
    qs.set("deliveryLat", String(deliveryPin.lat));
    qs.set("deliveryLng", String(deliveryPin.lng));
  }
  const suffix = qs.size ? `?${qs.toString()}` : "";
  return honoClient.get<BranchCatalog>(`/deliveries/catalog/${branchId}${suffix}`);
};

// Map a delivery listing item into the Branch shape BranchCard / BranchModal use.
export function deliveryBranchToBranch(d: DeliveryBranch): Branch {
  return {
    branchId: d.branchId,
    name: d.name,
    slug: d.slug,
    description: "",
    address: d.address ?? "",
    city: d.city ?? "",
    country: d.country ?? "",
    phone: d.delivery?.phone ?? "",
    whatsapp: d.delivery?.whatsapp ?? "",
    canContact: false,
    email: "",
    website: "",
    logoUrl: d.logoUrl ?? "",
    coverImageUrl: d.coverImageUrl,
    note: "",
    isActive: true,
    images: [],
    tags: null,
    createdAt: "",
    category: {
      categoryId: d.categoryId ?? 0,
      name: d.categoryName ?? "",
      description: "",
      image: "",
      slug: "",
    },
    merchant: {
      merchantId: 0,
      name: "",
      description: "",
      logoUrl: "",
      country: d.country ?? "",
      state: "",
      founder: false,
      createdAt: "",
    },
    offers: (d.offers ?? []).map((o) => ({
      offerId: o.offerId,
      title: o.title,
      description: "",
      offerType: o.offerType,
      value: "",
      conditions: "",
      validFrom: "",
      validTo: null,
      validDays: o.validDays ?? [],
      isActive: true,
      expiresAt: null,
      excludesBankHolidays: false,
    })),
    favoritesCount: 0,
  };
}
