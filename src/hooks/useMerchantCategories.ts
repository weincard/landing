import { useQuery } from "@tanstack/react-query";
import { getMerchantCategories } from "@/api/merchantCategories";

export function useMerchantCategories() {
  return useQuery({
    queryKey: ["merchant-categories"],
    queryFn: () => getMerchantCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
}
