export interface ICoupon {
  couponId?: number;
  code?: string;
  name?: string;
  description?: string;
  planId?: number;
  maxRedemptions?: number;
  renewalCount?: number;
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
