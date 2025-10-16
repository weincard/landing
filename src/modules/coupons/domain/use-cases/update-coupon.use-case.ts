import { inject, injectable } from "inversify";
import type { CouponsRepository } from "../../data/repositories/coupons.repository";
import type { CouponResponse } from "../../data/interfaces/coupons.response.interface";
import type { ICoupon } from "@/data/interfaces/coupon.interface";

@injectable()
export class UpdateCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: CouponsRepository
  ) {}

  async execute(
    couponId: number,
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse> {
    return await this.couponsRepository.update(couponId, couponData, token);
  }
}
