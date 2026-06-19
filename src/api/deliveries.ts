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
  delivery: {
    contactType: string | null;
    whatsapp: string | null;
    phone: string | null;
    contactMessage: string;
    deliveryFee: number | string | null;
    minimumOrder: number | string | null;
    estimatedTime: string | null;
  };
  offers: {
    offerId: number;
    title: string;
    offerType: string;
    validDays: string[];
    membershipPlanId: number | null;
    membershipPlanLevel: number | null;
  }[];
}

export const getDeliveryBranches = (coords: Coords) =>
  honoClient.get<{ data: DeliveryBranch[]; count: number }>(
    `/deliveries/branches?lat=${coords.lat}&lng=${coords.lng}`,
  );

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
    category: { categoryId: 0, name: "", description: "", image: "", slug: "" },
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
      validDays: o.validDays,
      isActive: true,
      expiresAt: null,
      excludesBankHolidays: false,
    })),
    favoritesCount: 0,
  };
}
