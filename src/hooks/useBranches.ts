import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { filterBranches, getBranchById, type BranchFilterParams } from "@/api/branches";

const PAGE_SIZE = 18;

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

export function useBranchDetail(branchId: number) {
  return useQuery({
    queryKey: ["branch", branchId],
    queryFn: () => getBranchById(branchId).then((r) => r.data.branch),
    enabled: branchId > 0,
  });
}
