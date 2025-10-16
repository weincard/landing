import type {
  AllCouponsResponse,
  CouponResponse,
} from "../interfaces/coupons.response.interface";

export const allCouponsResponseAdapter = (data: any): AllCouponsResponse => {
  return {
    message: data.message || "Cupones obtenidos exitosamente",
    count: data.count || 0,
    coupons: data.coupons || [],
  };
};

export const getCouponResponseAdapter = (data: any): CouponResponse => {
  return {
    message: data.message || "Cupón obtenido exitosamente",
    coupon: data.coupon || data,
  };
};

export const createCouponResponseAdapter = (data: any): CouponResponse => {
  return {
    message: data.message || "Cupón creado exitosamente",
    coupon: data.coupon || data,
  };
};

export const updateCouponResponseAdapter = (data: any): CouponResponse => {
  return {
    message: data.message || "Cupón actualizado exitosamente",
    coupon: data.coupon || data,
  };
};
