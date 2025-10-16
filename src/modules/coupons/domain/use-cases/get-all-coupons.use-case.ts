import { inject, injectable } from "inversify";
import type { CouponsRepository } from "../../data/repositories/coupons.repository";
import type { AllCouponsResponse } from "../../data/interfaces/coupons.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetAllCouponsUseCase {
  constructor(
    @inject("CouponsRepository")
    private couponsRepository: CouponsRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllCouponsResponse> {
    return await this.couponsRepository.getAll(
      token,
      paginationParams,
      filters
    );
  }
}
