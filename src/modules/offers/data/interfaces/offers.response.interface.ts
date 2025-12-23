export interface IOffer {
  offerId: number;
  title: string;
  description: string;
  offerType: "percentage" | "fixed_amount" | "promo" | "menu_weincard";
  value: string;
  conditions: string;
  validFrom: string;
  validTo: string | null;
  validDays: string[];
  isActive: boolean;
  expiresAt: string | null;
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId: number;
  createdAt: string;
  updatedAt?: string;
  membershipPlan?: {
    membershipPlanId: number;
    name: string;
  };
  branch?: {
    branchId: number;
    name: string;
  };
}

export interface AllOffersResponse {
  offers: IOffer[];
  count: number;
}

export interface OfferResponse {
  message?: string;
  offer: IOffer;
}

export interface CreateOfferRequest {
  title: string;
  description: string;
  offerType: "percentage" | "fixed_amount" | "promo" | "menu_weincard";
  value: string;
  conditions: string;
  validFrom: string;
  validTo: string | null;
  validDays?: string[];
  isActive: boolean;
  expiresAt: string | null;
  excludesBankHolidays: boolean;
  membershipPlanId: number;
  branchId: number;
}

export interface UpdateOfferRequest extends Partial<CreateOfferRequest> {}
