import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type { BranchesRepository } from "../../data/repositories/branches.repository";
import type { AllBranchesResponse } from "../../data/interfaces/branches.response.interface";

@injectable()
export class GetAllBranchesUseCase {
  constructor(
    @inject("BranchesRepository")
    private branchesRepository: BranchesRepository
  ) {}

  async execute(
    merchantId?: number,
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllBranchesResponse> {
    return await this.branchesRepository.getAll(
      merchantId,
      token,
      paginationParams,
      filters
    );
  }
}
