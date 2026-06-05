import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelMembership,
  getMembershipPlans,
  createCheckoutSession,
} from "@/api/memberships";
import { redeemCoupon } from "@/api/coupons";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { PlanKey } from "@/types";

export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => getMembershipPlans().then((r) => r.data.membershipPlans ?? []),
    staleTime: Infinity,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: ({ email, plan }: { email: string; plan: PlanKey }) =>
      createCheckoutSession(email, plan).then((r) => r.data),
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
