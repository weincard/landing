export interface AuthUser {
  id: number;
  name: string;
  lastname?: string;
  email?: string;
  phone: string;
  role?: string;
  roleId?: number;
  isVerified?: boolean;
  createdAt?: string;
}

export interface Membership {
  id: number;
  status: string;
  planName?: string;
  plan?: { name?: string };
  membershipPlan?: { name?: string; duration?: string };
  duration?: string;
  expiresAt?: string;
  endDate?: string;
}

export interface Offer {
  offerId: number;
  title: string;
  description: string;
  offerType: string;
  value: string;
  conditions: string;
  validFrom: string;
  validTo: string | null;
  validDays: string[];
  isActive: boolean;
  expiresAt: string | null;
  excludesBankHolidays: boolean;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface Merchant {
  merchantId: number;
  name: string;
  description: string;
  logoUrl: string;
  country: string;
  state: string;
  founder: boolean;
  createdAt: string;
}

export interface Branch {
  branchId: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  whatsapp: string;
  canContact: boolean;
  email: string;
  website: string;
  logoUrl: string;
  coverImageUrl: string | null;
  note: string;
  isActive: boolean;
  images: string[];
  tags: string[] | null;
  createdAt: string;
  category: Category;
  merchant: Merchant;
  offers: Offer[];
  favoritesCount: number;
}

export interface TypesenseOfferDocument {
  id: string;
  title: string;
  description: string;
  conditions: string;
  value: string;
  offerType: string;
  isActive: boolean;
  excludesBankHolidays: boolean;
  validDays?: string[];
  membershipPlanId?: number;
  validFrom: number;
  validTo?: number;
  expiresAt?: number;
  branchId?: number;
  branchName?: string;
  city?: string;
  country?: string;
  categoryId?: number;
  categoryName?: string;
  merchantId?: number;
  merchantName?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  images?: string[];
}

export interface TypesenseGroupedResponse {
  found: number;
  grouped_hits: Array<{
    group_key: (string | number)[];
    hits: Array<{ document: TypesenseOfferDocument }>;
  }>;
}

export type PlanKey = "monthly" | "yearly";

export interface RedemptionResult {
  redemptionCode?: string;
  code?: string;
  totalPaid?: number;
  user?: { phone?: string };
  phone?: string;
  message?: string;
}
