import type { ICoupon } from "@/data/interfaces/coupon.interface";

export interface CouponResponse {
  message: string;
  coupon: ICoupon;
}

export interface AllCouponsResponse {
  message: string;
  count: number;
  coupons: ICoupon[];
}
