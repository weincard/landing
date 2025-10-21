export interface IMembershipPlan {
  membershipPlanId: number;
  name: string;
  description: string;
  price: number;
  duration: "monthly" | "quarterly" | "yearly";
  createdAt?: string;
  updatedAt?: string;
}

export interface GetAllMembershipPlansResponse {
  count: number;
  membershipPlans: IMembershipPlan[];
}
