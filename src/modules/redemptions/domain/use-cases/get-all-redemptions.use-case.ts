import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type { AllRedemptionsResponse } from "../../data/interfaces/redemptions.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetAllRedemptionsUseCase {
  constructor(
    @inject("RedemptionsRepository")
    private redemptionsRepository: RedemptionsRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null; branchName?: string; userName?: string }
  ): Promise<AllRedemptionsResponse> {
    return await this.redemptionsRepository.getAll(
      token,
      paginationParams,
      filters
    );
  }
}
