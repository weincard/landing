import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyRedemptions, generateCode } from "@/api/redemptions";

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
    mutationFn: (offerId: number) =>
      generateCode(offerId).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["redemptions"] }),
  });
}
