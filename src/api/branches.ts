import { honoClient } from "./honoClient";
import type { Branch, Offer } from "@/types";

export const getBranchById = (branchId: number) =>
  honoClient.get<{ branch: Branch }>(`/branches/one/${branchId}`);

// ─── Branch detail (the SAME aggregating endpoint the Flutter app uses) ───────
// GET /branches/detail returns the full branch PLUS its active offers (as a
// top-level array, each carrying membership-plan + channel info, admin-sorted)
// and sibling `sucursales`. Unlike /branches/one, which omits offers entirely,
// this is what powers the branch-detail view and its redeem CTAs.
export interface BranchDetailResponse {
  kind: string;
  branch: Branch;
  offers: Offer[];
  sucursales: Array<{
    branchId: number;
    name: string | null;
    image: string | null;
    city: string | null;
    location: [number, number] | null;
  }>;
}

// Optional `channelIds` scopes the returned offers to the browsing merchant
// category's allowed channels (e.g. Domicilios → delivery), matching Flutter's
// `GET /branches/detail/:branchId?channelIds=2`.
export const getBranchDetail = (branchId: number, channelIds: number[] = []) => {
  const path =
    channelIds.length > 0
      ? `/branches/detail/${branchId}?channelIds=${channelIds.join(",")}`
      : `/branches/detail/${branchId}`;
  return honoClient.get<BranchDetailResponse>(path);
};

// ─── Branch tiles (the SAME browse endpoint the Flutter app uses) ─────────────
// GET /branches/tiles is public, Typesense-backed, and supports server-side
// merchant-category + valid-days + text filtering and geo. This is the canonical
// browse/search source for both /app/explore and /catalogo.

export interface BranchTileOffer {
  offerId: number;
  title: string;
  description: string;
  offerType: string;
  validDays: string[];
  membershipPlanId: number | null;
  membershipPlanLevel: number | null;
}

export interface BranchTile {
  branchId: number | null;
  name: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  images: string[];
  city: string | null;
  location: [number, number] | null;
  categoryId: number | null;
  categoryName: string | null;
  merchantCategoryId: number | null;
  merchantCategoryName: string | null;
  lightOfferSummary: BranchTileOffer[];
}

export interface BranchTilesResponse {
  kind: string;
  isSearch: boolean;
  near_me: BranchTile[];
  below: BranchTile[];
  hasMore: boolean;
}

export interface BranchTilesParams {
  q?: string;
  merchantCategoryId?: number;
  validDays?: string[];
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
}

export const getBranchTiles = (params: BranchTilesParams) => {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.merchantCategoryId) qs.set("merchantCategoryId", String(params.merchantCategoryId));
  if (params.validDays?.length) qs.set("validDays", params.validDays.join(","));
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.lat != null && params.lng != null) {
    qs.set("lat", String(params.lat));
    qs.set("lng", String(params.lng));
  }
  return honoClient.get<BranchTilesResponse>(`/branches/tiles?${qs.toString()}`);
};

// Map a light tile into the Branch shape the BranchCard / BranchModal expect.
// Tiles are intentionally light (no address/phone) — same as the previous
// Typesense-derived catalog branches.
export function tileToBranch(tile: BranchTile): Branch {
  return {
    branchId: tile.branchId ?? 0,
    name: tile.name ?? "",
    slug: "",
    description: "",
    address: "",
    city: tile.city ?? "",
    country: "",
    phone: "",
    whatsapp: "",
    canContact: false,
    email: "",
    website: "",
    logoUrl: tile.logoUrl ?? "",
    coverImageUrl: tile.coverImageUrl,
    note: "",
    isActive: true,
    images: tile.images ?? [],
    tags: null,
    createdAt: "",
    category: {
      categoryId: tile.categoryId ?? 0,
      name: tile.categoryName ?? "",
      description: "",
      image: "",
      slug: "",
    },
    merchant: {
      merchantId: 0,
      name: "",
      description: "",
      logoUrl: "",
      country: "",
      state: "",
      founder: false,
      createdAt: "",
    },
    offers: tile.lightOfferSummary.map((o) => ({
      offerId: o.offerId,
      title: o.title,
      description: o.description,
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
