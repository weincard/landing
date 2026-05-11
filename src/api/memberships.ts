import { apiClient } from "./client";
import type { PlanKey } from "@/types";

export const getMembershipsByUser = () =>
  apiClient.get("/memberships/by-user");

export const createCheckoutSession = (email: string, plan: PlanKey) =>
  apiClient.post<{ url: string }>("/memberships/session/create", {
    email,
    membershipPlan: plan,
  });
