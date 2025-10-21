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
  createdAt?: string;
  updatedAt?: string;

  // Relaciones
  plan?: {
    planId: number;
    name: string;
    price: number;
  };
  branches?: Array<{
    branchId: number;
    name: string;
    city?: string;
  }>;
}
