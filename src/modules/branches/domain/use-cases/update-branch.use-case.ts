import { inject, injectable } from "inversify";
import type { BranchesRepository } from "../../data/repositories/branches.repository";
import type { BranchResponse } from "../../data/interfaces/branches.response.interface";
import type { IBranch } from "@/data/interfaces/merchant.interface";

@injectable()
export class UpdateBranchUseCase {
  constructor(
    @inject("BranchesRepository")
    private branchesRepository: BranchesRepository
  ) {}

  async execute(
    branchId: number,
    branchData: Partial<IBranch>,
    logoFile?: File | null,
    imageFiles?: File[],
    token?: string
  ): Promise<BranchResponse> {
    return await this.branchesRepository.update(
      branchId,
      branchData,
      logoFile,
      imageFiles,
      token
    );
  }
}
