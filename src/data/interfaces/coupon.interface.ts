export interface ICoupon {
  couponId?: number;
  code?: string;
  name?: string;
  description?: string;
  membershipPlanId?: number;
  planId?: number; // Para compatibilidad con respuestas que usen planId
  maxRedemptions?: number;
  renewalCount?: number;
  discountType?: "fixed" | "percentage";
  discountPercentage?: number; // Cuando es tipo percentage (1-100)
  discountAmount?: number; // Cuando es tipo fixed (monto en $)
  discountValue?: number; // Para compatibilidad
  expirationDate?: string;
  branchIds?: number[];
  isActive?: boolean;
  redemptionsCount?: number;
  usageCount?: number;
  createdAt?: string;
  updatedAt?: string;

  // Relaciones
  plan?: {
    planId: number;
    name: string;
    price: number;
  };
  membershipPlan?: {
    membershipPlanId: number;
    name: string;
    description?: string;
    price: string;
    duration: string;
  };
  memberships?: any[];
  branches?: Array<{
    branchId: number;
    name: string;
    city?: string;
  }>;
}
