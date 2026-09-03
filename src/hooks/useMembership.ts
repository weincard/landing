import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelMembership,
  getMembershipPlans,
  createCheckoutSession,
  createPortalSession,
  getFamily,
  inviteFamilyMember,
  acceptFamilyInvite,
  declineFamilyInvite,
  removeFamilyMember,
  leaveFamily,
} from "@/api/memberships";
import { redeemCoupon } from "@/api/coupons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { PlanKey } from "@/types";

export function useMembershipPlans(includeFamily = false) {
  return useQuery({
    queryKey: ["membership-plans", includeFamily],
    queryFn: () =>
      getMembershipPlans(includeFamily).then(
        (r) => r.data.membershipPlans ?? [],
      ),
    staleTime: Infinity,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ email, plan }: { email: string; plan: PlanKey }) =>
      createCheckoutSession(email, plan).then((r) => r.data),
  });
}

export function useCreatePortalSession() {
  return useMutation({
    mutationFn: () => createPortalSession().then((r) => r.data),
  });
}

export function useRedeemCoupon() {
  const { refreshMembership } = useAuth();
  return useMutation({
    mutationFn: (code: string) => redeemCoupon(code),
    onSuccess: () => refreshMembership(),
  });
}

export function useCancelMembership() {
  const queryClient = useQueryClient();
  const { refreshMembership } = useAuth();

  return useMutation({
    mutationFn: (membershipId: number) => cancelMembership(membershipId),
    onSuccess: async () => {
      await refreshMembership();
      queryClient.invalidateQueries({ queryKey: ["membership-status"] });
    },
  });
}

// ─── Family plans ────────────────────────────────────────────────────────────

export function useFamily(enabled = true) {
  return useQuery({
    queryKey: ["family"],
    queryFn: () => getFamily().then((r) => r.data),
    enabled,
  });
}

// All family mutations invalidate the family query; the ones that change the
// caller's own membership (accept / leave) also refresh the session.
function useFamilyMutation<TArgs>(
  fn: (args: TArgs) => Promise<unknown>,
  refreshSession = false,
) {
  const queryClient = useQueryClient();
  const { refreshMembership } = useAuth();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
      if (refreshSession) await refreshMembership();
    },
  });
}

export function useInviteFamilyMember() {
  return useFamilyMutation((phone: string) => inviteFamilyMember(phone));
}

export function useAcceptFamilyInvite() {
  return useFamilyMutation(
    (inviteId: number) => acceptFamilyInvite(inviteId),
    true,
  );
}

export function useDeclineFamilyInvite() {
  return useFamilyMutation((inviteId: number) => declineFamilyInvite(inviteId));
}

export function useRemoveFamilyMember() {
  return useFamilyMutation((userId: number) => removeFamilyMember(userId));
}

export function useLeaveFamily() {
  return useFamilyMutation(() => leaveFamily(), true);
}
