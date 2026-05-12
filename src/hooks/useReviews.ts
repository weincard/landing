import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviewsByBranch, createReview } from "@/api/reviews";

export function useReviews(branchId: number) {
  return useQuery({
    queryKey: ["reviews", branchId],
    queryFn: () => getReviewsByBranch(branchId).then((r) => r.data.reviews ?? []),
    enabled: branchId > 0,
  });
}

export function useCreateReview(branchId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rating, comment }: { rating: number; comment: string }) =>
      createReview(branchId, rating, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews", branchId] }),
  });
}
