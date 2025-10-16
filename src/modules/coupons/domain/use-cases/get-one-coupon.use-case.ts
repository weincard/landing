import { inject, injectable } from "inversify";
import type { CouponsRepository } from "../../data/repositories/coupons.repository";
import type { CouponResponse } from "../../data/interfaces/coupons.response.interface";

@injectable()
export class GetOneCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: CouponsRepository
  ) {}

  async execute(couponId: number, token?: string): Promise<CouponResponse> {
    return await this.couponsRepository.getOne(couponId, token);
  }
}
