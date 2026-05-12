import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/branches";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories().then((r) => r.data.categories ?? []),
    staleTime: Infinity,
  });
}
