import { useQuery } from "@tanstack/react-query";
import { getAppConfig } from "@/api/config";

// Reads the public app_config singleton. `/config/app` is public (no auth), so
// this works pre-login too. We default flags to the conservative/hidden value
// while loading or on error, so operator-disabled UI never flashes on screen.
export function useAppConfig() {
  return useQuery({
    queryKey: ["app-config"],
    queryFn: () => getAppConfig().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

// Convenience: whether the coupon/promo input should be shown anywhere in the
// app. Defaults to false until the config resolves.
export function useShowCouponInput(): boolean {
  const { data } = useAppConfig();
  return data?.showCouponInput ?? false;
}
