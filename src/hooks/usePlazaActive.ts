import { useQuery } from "@tanstack/react-query";
import { getPlazaActive } from "@/api/plaza";

export function usePlazaActive() {
  return useQuery({
    queryKey: ["plaza-active"],
    queryFn: () => getPlazaActive().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}
