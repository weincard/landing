import { apiClient } from "./client";
import type { Review } from "@/types";

export const getReviewsByBranch = (branchId: number) =>
  apiClient.get<{ reviews: Review[] }>(`/reviews/by-branch/${branchId}`);

export const createReview = (
  branchId: number,
  rating: number,
  comment: string
) => apiClient.post("/reviews/create", { branchId, rating, comment });
