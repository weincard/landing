import { honoClient } from "./honoClient";
import type { Review } from "@/types";

export const getReviewsByBranch = (branchId: number) =>
  honoClient.get<{ reviews: Review[] }>(`/reviews/by-branch/${branchId}`);

export const createReview = (
  branchId: number,
  rating: number,
  comment: string
) => honoClient.post("/reviews/create", { branchId, rating, comment });
