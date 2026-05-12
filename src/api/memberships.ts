import { apiClient } from "./client";
import type { MembershipPlan, PlanKey } from "@/types";

export const getMembershipsByUser = () =>
  apiClient.get("/memberships/by-user");

export const getMembershipPlans = () =>
  apiClient.get<{ plans: MembershipPlan[] }>("/memberships/plans/all");

export const createCheckoutSession = (email: string, plan: PlanKey) =>
  apiClient.post<{ url: string }>("/memberships/session/create", {
    email,
    membershipPlan: plan,
  });

export const cancelMembership = (membershipId: number) =>
  apiClient.post(`/memberships/cancel/${membershipId}`);
