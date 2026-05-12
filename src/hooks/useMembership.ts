import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMembership, getMembershipPlans } from "@/api/memberships";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export function useMembershipPlans() {
  return useQuery({
    queryKey: ["membership-plans"],
    queryFn: () => getMembershipPlans().then((r) => r.data.plans ?? []),
    staleTime: Infinity,
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
