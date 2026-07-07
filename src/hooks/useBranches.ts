import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getBranchDetail,
  getBranchTiles,
  tileToBranch,
  type BranchTilesResponse,
} from "@/api/branches";
import { getDeliveryBranches, deliveryBranchToBranch } from "@/api/deliveries";
import type { Branch } from "@/types";
import type { Coords } from "@/lib/location";

const BROWSE_PAGE_SIZE = 18;

export interface BrowseFilters {
  search: string;
  merchantCategoryId: number | null;
  validDays: string[];
  /** "Cerca de mí": when true we send lat/lng so results are geo-sorted and the
   *  backend returns a populated near_me set; when false we omit coordinates. */
  nearMe: boolean;
}

// Unified branch browse/search — backed by GET /branches/tiles, the SAME public
// endpoint the Flutter app uses (server-side merchant-category + valid-days +
// text filtering via Typesense, distance-sorted). Powers both /app/explore and
// /catalogo. Coordinates are ALWAYS sent (real or default) — Flutter never hits
// the no-geo path, which is unreliable on the deployed backend.
export function useBranchBrowse(filters: BrowseFilters, location: Coords, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["branch-tiles", filters, location],
    enabled,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }) => {
      const res = await getBranchTiles({
        q: filters.search.trim() || undefined,
        merchantCategoryId: filters.merchantCategoryId ?? undefined,
        validDays: filters.validDays.length ? filters.validDays : undefined,
        // Only send coordinates when "Cerca de mí" is on. Without them the
        // backend returns near_me=[] and a full, non-geo-sorted `below` list.
        lat: filters.nearMe ? location.lat : undefined,
        lng: filters.nearMe ? location.lng : undefined,
        page: pageParam as number,
        limit: BROWSE_PAGE_SIZE,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}

/** Flattens the infinite-query pages into Branch cards. When "Cerca de mí" is
 *  on, the first page carries a `near_me` set (the nearby branches) — surface
 *  those first, then the paginated `below` list, de-duplicated by branchId.
 *  When it's off, near_me is empty and this is just the `below` list. */
export function browseBranches(pages: BranchTilesResponse[] | undefined): Branch[] {
  const all = pages ?? [];
  const nearMe = (all[0]?.near_me ?? []).map(tileToBranch);
  const below = all.flatMap((p) => p.below).map(tileToBranch);
  const seen = new Set(nearMe.map((b) => b.branchId));
  return [...nearMe, ...below.filter((b) => !seen.has(b.branchId))];
}

// The "Domicilios" merchant category uses GET /deliveries/branches (not tiles),
// matching Flutter. Returns ALL matching branches geo-sorted (not paginated).
export function useDeliveryBranches(location: Coords, enabled: boolean) {
  return useQuery({
    queryKey: ["delivery-branches", location],
    enabled,
    queryFn: () =>
      getDeliveryBranches(location).then((r) => r.data.data.map(deliveryBranchToBranch)),
  });
}

// Calls /branches/detail (offers included) and merges the top-level `offers`
// array onto the branch, so consumers keep reading `branch.offers`.
export function useBranchDetail(branchId: number, channelIds: number[] = []) {
  return useQuery({
    // channelIds is part of the key: the same branch returns a different offer
    // set when scoped to a category's channels (e.g. Domicilios → delivery).
    queryKey: ["branch", branchId, channelIds],
    queryFn: () =>
      getBranchDetail(branchId, channelIds).then((r) => ({
        ...r.data.branch,
        offers: r.data.offers ?? [],
      })),
    enabled: branchId > 0,
  });
}
