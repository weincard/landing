// Normalized client-side user. The hono backend returns `/auth/me` as
// `{ user: { userId, name, email, role: { name }, ... } }` (name stored
// tilde-joined as `first~last`). `mapAuthUser` in api/auth.ts flattens that into
// this shape — `id` is kept as an alias of `userId` for existing call sites.
export interface AuthUser {
  id: number;
  userId: number;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  document: string | null;
  profileUrl?: string | null;
  role: string | null;
  isVerified?: boolean;
  /** Email proven via the email verification code flow. */
  isEmailVerified?: boolean;
  /** Phone proven via OTP. Distinct from `isVerified` (set on any finished registration). */
  isPhoneVerified?: boolean;
  createdAt?: string;
}

// ─── Membership (new shape from GET /users/status) ───────────────────────────

export interface MembershipInfo {
  membershipId: number;
  status: "active" | "canceled" | "pending_cancel" | "trialing" | "ended" | "pastDue" | "unpaid" | "paused" | "incomplete" | string;
  startedAt: string;
  renewedAt: string | null;
  expiredAt: string | null;
  membershipPlanId: number;
  membershipPlanName: string;
  membershipPlanDuration: "monthly" | "quarterly" | "yearly";
  couponId: number | null;
  paymentMethod: string | null;
}

export interface CouponRedemptionInfo {
  redemptionId: number;
  redeemedAt: string;
  membershipExpiresAt: string;
  status: string;
  couponId: number;
  trialUsageCount: number;
  renewalCount: number;
  trialType: string;
  usesLeft: number;
}

export interface UserStatusResponse {
  userInfo: {
    userId: number;
    name: string;
    email: string;
    document: string | null;
    createdAt: string;
  };
  membership: MembershipInfo | null;
  couponRedemption: CouponRedemptionInfo | null;
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface MembershipPlan {
  membershipPlanId: number;
  name: string;
  duration: "monthly" | "quarterly" | "yearly";
  price: number;
  description?: string;
  isActive?: boolean;
}

// ─── Offers / Branches ───────────────────────────────────────────────────────

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

// Merchant category (Restaurantes, Gimnasios, Domicilios…) — distinct from the
// food `Category`. Used as a filter on the explore page.
export interface MerchantCategory {
  merchantCategoryId: number;
  name: string;
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

// ─── Favorites ───────────────────────────────────────────────────────────────

export interface Favorite {
  favoriteId: number;
  branch: Branch;
  createdAt: string;
}

// ─── Redemptions ─────────────────────────────────────────────────────────────

export interface Redemption {
  redemptionId: number;
  offerId?: number;
  branchId?: number;
  branchName?: string;
  offerTitle?: string;
  discountAmount?: number;
  totalPaid?: number;
  createdAt: string;
  code?: string;
  branch?: Branch;
  offer?: Offer;
}

export interface GeneratedCode {
  code: string;
  offerId: number;
  expiresAt?: string;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export interface Review {
  reviewId: number;
  rating: number;
  comment: string;
  user: { name: string; lastname?: string };
  createdAt: string;
}

// ─── Typesense (unchanged) ───────────────────────────────────────────────────

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
  sortOrder?: number;
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
  // The verify endpoint returns the RedemptionCode record with its `user` and
  // `branch` relations loaded. `user.name` is stored tilde-joined (`first~last`).
  user?: { phone?: string; name?: string };
  branch?: { name?: string };
  phone?: string;
  message?: string;
}

// ─── Legacy shape (kept for backward compat in existing pages) ───────────────

/** @deprecated Use MembershipInfo instead */
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
