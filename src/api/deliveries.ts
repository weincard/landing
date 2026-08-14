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
}

export const getDeliveryBranches = (
  coords: Coords,
  { q, categoryId, validDays }: DeliveryBranchesParams = {},
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
  const path = `${query ? "/deliveries/search" : "/deliveries/branches"}?${qs.toString()}`;
  return honoClient.get<{ data: DeliveryBranch[]; count: number }>(path);
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
