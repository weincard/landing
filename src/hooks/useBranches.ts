import { useInfiniteQuery, useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  filterBranches,
  getBranchById,
  searchBranches,
  type BranchFilterParams,
} from "@/api/branches";
import type { ExploreFilters } from "@/components/explore/FilterPanel";
import type { Branch } from "@/types";

const PAGE_SIZE = 18;
const CATALOG_PAGE_SIZE = 12;

export function useFilteredBranches(filters: Omit<BranchFilterParams, "limit" | "skip">) {
  return useInfiniteQuery({
    queryKey: ["branches", "explore", filters],
    queryFn: ({ pageParam = 0 }) =>
      filterBranches({ ...filters, limit: PAGE_SIZE, skip: pageParam as number }).then(
        (r) => r.data
      ),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p.branches).length;
      if (loaded >= lastPage.count) return undefined;
      return loaded;
    },
    initialPageParam: 0,
  });
}

// Structured filters (day / category / benefit type) can't be expressed through
// the Typesense search used for plain text queries, so when any are active the
// catalog routes its requests to the POST /branches/filter endpoint instead.
function hasStructuredFilters(f: ExploreFilters): boolean {
  return f.categoryIds.length > 0 || f.validDays.length > 0 || f.offerTypes.length > 0;
}

interface CatalogPage {
  branches: Branch[];
  total: number;
}

/**
 * Public catalog listing. Hybrid data source: plain text search uses Typesense;
 * as soon as any structured filter is active it switches to the REST filter
 * endpoint (which supports day/category/benefit-type filtering server-side).
 */
export function useCatalogBranches(filters: ExploreFilters) {
  const structured = hasStructuredFilters(filters);

  return useInfiniteQuery({
    queryKey: ["catalog", filters],
    initialPageParam: 0,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }): Promise<CatalogPage> => {
      if (structured) {
        const res = await filterBranches({
          name: filters.search.trim() || undefined,
          categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
          validDays: filters.validDays.length > 0 ? filters.validDays : undefined,
          offerTypes: filters.offerTypes.length > 0 ? filters.offerTypes : undefined,
          limit: CATALOG_PAGE_SIZE,
          skip: pageParam * CATALOG_PAGE_SIZE,
        });
        return { branches: res.data.branches, total: res.data.count };
      }
      // Typesense search pages are 1-based.
      const res = await searchBranches(filters.search, pageParam + 1);
      return { branches: res.branches, total: res.found };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((n, p) => n + p.branches.length, 0);
      return loaded < lastPage.total ? allPages.length : undefined;
    },
  });
}

export function useBranchDetail(branchId: number) {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => getBranchById(branchId).then((r) => r.data.branch),
    enabled: branchId > 0,
  });
}
