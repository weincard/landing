import { inject, injectable } from "inversify";
import type { BranchesRepository } from "../../data/repositories/branches.repository";
import type { BranchResponse } from "../../data/interfaces/branches.response.interface";

@injectable()
export class GetOneBranchUseCase {
  constructor(
    @inject("BranchesRepository")
    private branchesRepository: BranchesRepository
  ) {}

  async execute(branchId: number, token?: string): Promise<BranchResponse> {
    return await this.branchesRepository.getOne(branchId, token);
  }
}
