import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";

// Branch (food) categories scoped to a merchant (ally) category — powers the
// category chips in BranchBrowser. Disabled while no category is selected
// ("Todos"): the unscoped endpoint returns a tree, and chips without a
// category context aren't shown anyway.
export function useCategories(merchantCategoryId: number | null) {
  return useQuery({
    queryKey: ["categories", merchantCategoryId],
    enabled: merchantCategoryId != null,
    staleTime: 5 * 60 * 1000,
    queryFn: () => getCategories(merchantCategoryId!).then((r) => r.data),
  });
}
