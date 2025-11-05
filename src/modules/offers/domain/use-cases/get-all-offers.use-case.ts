import { inject, injectable } from "inversify";
import type { OffersRepository } from "../../data/repositories/offers.repository";
import type { AllOffersResponse } from "../../data/interfaces/offers.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetAllOffersUseCase {
  constructor(
    @inject("OffersRepository")
    private offersRepository: OffersRepository
  ) {}

  async execute(
    branchId?: string,
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllOffersResponse> {
    return await this.offersRepository.getAll(
      branchId,
      token,
      paginationParams
    );
  }
}
