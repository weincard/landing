import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyRedemptions, generateCode, verifyCode } from "@/api/redemptions";

export function useMyRedemptions() {
  return useQuery({
    queryKey: ["redemptions"],
    queryFn: () => getMyRedemptions().then((r) => r.data.redemptions ?? []),
    staleTime: 0,
  });
}

export function useGenerateCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (branchId: number) =>
      generateCode(branchId).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redemptions"] }),
  });
}

// Stand-side: verify a scanned branch code (and optionally record the amount
// paid). Returns the raw response body for the caller to narrow.
export function useVerifyCode() {
  return useMutation({
    mutationFn: ({ code, totalPaid }: { code: string; totalPaid?: number }) =>
      verifyCode(code, totalPaid).then((r) => r.data),
  });
}
