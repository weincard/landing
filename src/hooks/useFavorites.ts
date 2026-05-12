import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/api/favorites";

export function useFavorites() {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => getFavorites().then((r) => r.data.favorites ?? []),
    staleTime: 0,
  });
}

export function useAddFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (branchId: number) => addFavorite(branchId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (branchId: number) => removeFavorite(branchId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
