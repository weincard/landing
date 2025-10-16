import { inject, injectable } from "inversify";
import type { CouponsRepository } from "../../data/repositories/coupons.repository";

@injectable()
export class DeleteCouponUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: CouponsRepository
  ) {}

  async execute(
    couponId: number,
    token?: string
  ): Promise<{ message: string }> {
    return await this.couponsRepository.delete(couponId, token);
  }
}
