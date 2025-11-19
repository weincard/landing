import { inject, injectable } from "inversify";
import type { BranchesRepository } from "../../data/repositories/branches.repository";
import type { BranchResponse } from "../../data/interfaces/branches.response.interface";
import type { IBranch } from "@/data/interfaces/merchant.interface";

@injectable()
export class CreateBranchUseCase {
  constructor(
    @inject("BranchesRepository")
    private branchesRepository: BranchesRepository
  ) {}

  async execute(
    branchData: Partial<IBranch>,
    token?: string
  ): Promise<BranchResponse> {
    return await this.branchesRepository.create(branchData, token);
  }
}
