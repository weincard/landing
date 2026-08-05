import { honoClient } from "./honoClient";
import type { FamilyInfo, MembershipPlan, PlanKey } from "@/types";

// Family plans are excluded server-side unless explicitly requested — deployed
// mobile clients key plan cards on duration only and must not see them.
export const getMembershipPlans = (includeFamily = false) =>
  honoClient.get<{ membershipPlans: MembershipPlan[] }>(
    `/memberships/plans/all${includeFamily ? "?includeFamily=true" : ""}`,
  );

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

// ─── Family plans ────────────────────────────────────────────────────────────
// 409s carry { code, message } — code ∈ no_seats_left | user_not_found |
// already_in_family | has_open_membership | is_b2b_member | is_family_owner |
// self_invite | owner_not_active | group_closed | invite_not_pending.

export const getFamily = () => honoClient.get<FamilyInfo>("/memberships/family");

export const inviteFamilyMember = (phone: string) =>
  honoClient.post<{ familyBeneficiaryId: number; status: string }>(
    "/memberships/family/invite",
    { phone },
  );

export const acceptFamilyInvite = (inviteId: number) =>
  honoClient.post(`/memberships/family/invites/${inviteId}/accept`);

export const declineFamilyInvite = (inviteId: number) =>
  honoClient.post(`/memberships/family/invites/${inviteId}/decline`);

export const removeFamilyMember = (userId: number) =>
  honoClient.delete(`/memberships/family/members/${userId}`);

export const leaveFamily = () => honoClient.delete("/memberships/family/leave");
