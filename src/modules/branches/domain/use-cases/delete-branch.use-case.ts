import { inject, injectable } from "inversify";
import type { BranchesRepository } from "../../data/repositories/branches.repository";

@injectable()
export class DeleteBranchUseCase {
  constructor(
    @inject("BranchesRepository")
    private branchesRepository: BranchesRepository
  ) {}

  async execute(
    branchId: number,
    token?: string
  ): Promise<{ message: string }> {
    return await this.branchesRepository.delete(branchId, token);
  }
}
