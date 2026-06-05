import { honoClient } from "./honoClient";
import type { MembershipPlan, PlanKey } from "@/types";

export const getMembershipPlans = () =>
  honoClient.get<{ membershipPlans: MembershipPlan[] }>("/memberships/plans/all");

export const createCheckoutSession = (email: string, plan: PlanKey) =>
  honoClient.post<{ url: string }>("/memberships/session/create", {
    email,
    membershipPlan: plan,
  });

export const cancelMembership = (membershipId: number) =>
  honoClient.post(`/memberships/cancel/${membershipId}`);
