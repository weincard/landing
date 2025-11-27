import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type { AllRedemptionsResponse } from "../../data/interfaces/redemptions.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetMyRedemptionsUseCase {
  constructor(
    @inject("RedemptionsRepository")
    private redemptionsRepository: RedemptionsRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllRedemptionsResponse> {
    return await this.redemptionsRepository.getByMe(token, paginationParams);
  }
}
