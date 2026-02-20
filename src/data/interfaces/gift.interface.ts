export interface IGift {
  giftId?: number;
  name?: string;
  description?: string;
  branchIds?: number[];
  membershipPlanIds?: number[];
  quantity?: number;
  code?: string;
  expirationDate?: string;
  isActive?: boolean;
  redemptionsCount?: number;
  createdAt?: string;
  updatedAt?: string;

  // Relaciones
  branches?: Array<{
    branchId: number;
    name: string;
    city?: string;
  }>;
  membershipPlans?: Array<{
    membershipPlanId: number;
    name: string;
    description?: string;
    price: string;
    duration: string;
  }>;
}
