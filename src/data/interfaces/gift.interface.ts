export interface IGift {
  id?: number;
  giftId?: number; // Keep for backward compatibility if needed, but 'id' seems to be the one used in responses
  name?: string;
  description?: string;
  conditions?: string;
  branchIds?: number[];
  membershipPlanIds?: number[];
  applyWithoutMembership?: boolean;
  quantity?: number; // Legacy field
  totalQuantity?: number;
  manualCodes?: string[];
  manualUserIds?: number[];
  expirationDate?: string;
  isActive?: boolean;
  redemptionsCount?: number; // Legacy field
  totalRedemptions?: number;
  status?: string;
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
  giftCodes?: Array<{
    id: number;
    code: string;
    viewedAt: string | null;
    user: {
      userId: number;
      phone: string;
      email: string;
    };
  }>;
}
