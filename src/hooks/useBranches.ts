import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getBranchById,
  getBranchTiles,
  tileToBranch,
} from "@/api/branches";
import { getDeliveryBranches, deliveryBranchToBranch } from "@/api/deliveries";
import type { Branch } from "@/types";
import type { Coords } from "@/lib/location";

const BROWSE_PAGE_SIZE = 18;

export interface BrowseFilters {
  search: string;
  merchantCategoryId: number | null;
  validDays: string[];
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
        lat: location.lat,
        lng: location.lng,
        page: pageParam as number,
        limit: BROWSE_PAGE_SIZE,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });
}

/** Flattens the infinite-query pages into Branch cards. */
export function browseBranches(
  pages: { below: Parameters<typeof tileToBranch>[0][] }[] | undefined,
): Branch[] {
  return (pages ?? []).flatMap((p) => p.below).map(tileToBranch);
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

export function useBranchDetail(branchId: number) {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => getBranchById(branchId).then((r) => r.data.branch),
    enabled: branchId > 0,
  });
}
