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

/** Result of the stateless Somos eligibility check (/verificacion-somos). */
export interface SomosVerifyResult {
  valid: boolean;
  user: { name: string | null; maskedPhone: string | null };
  plan: { membershipPlanId: number; name: string } | null;
  membershipStatus: string | null;
}

// Public — used by Somos partner reps; wrong/absent secret → 404.
export const verifySomosCode = (code: string) =>
  honoClient.get<SomosVerifyResult>(
    `/memberships/somos/verify/${encodeURIComponent(code)}`,
  );
