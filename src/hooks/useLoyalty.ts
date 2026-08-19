import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentSeason,
  getMyRank,
  getMyGifts,
  getSeasonPrizes,
  selectGift,
} from "@/api/loyalty";

export function useCurrentSeason() {
  return useQuery({
    queryKey: ["loyalty", "season"],
    queryFn: getCurrentSeason,
    staleTime: 60_000,
  });
}

export function useMyRank() {
  return useQuery({
    queryKey: ["loyalty", "rank"],
    queryFn: getMyRank,
    staleTime: 30_000,
  });
}

export function useMyGifts() {
  return useQuery({
    queryKey: ["loyalty", "gifts"],
    queryFn: getMyGifts,
    staleTime: 30_000,
  });
}

export function useSeasonPrizes() {
  return useQuery({
    queryKey: ["loyalty", "prizes"],
    queryFn: getSeasonPrizes,
    staleTime: 60_000,
  });
}

export function useSelectGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      giftId,
      optionId,
      merchantId,
    }: {
      giftId: number;
      optionId: number;
      merchantId: number;
    }) => selectGift(giftId, optionId, merchantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loyalty", "gifts"] }),
  });
}
