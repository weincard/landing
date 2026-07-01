import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPlazaActive,
  verifyPlazaCode,
  generatePlazaRedemption,
} from "@/api/plaza";

export function usePlazaActive() {
  return useQuery({
    queryKey: ["plaza-active"],
    queryFn: () => getPlazaActive().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

// Public: the stand opens the scanned QR link and this verifies + completes the
// redemption in one call.
export function useVerifyPlazaCode() {
  return useMutation({
    mutationFn: (code: string) => verifyPlazaCode(code).then((r) => r.data),
  });
}

// Member mints a one-time code (the QR payload) for a given stand.
export function useGeneratePlazaRedemption() {
  return useMutation({
    mutationFn: (plazaMerchantId: number) =>
      generatePlazaRedemption(plazaMerchantId).then((r) => r.data),
  });
}
