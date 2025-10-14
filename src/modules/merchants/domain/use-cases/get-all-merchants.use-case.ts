import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type { MerchantsRepository } from "../../data/repositories/merchants.repository";
import type { AllMerchantsResponse } from "../../data/interfaces/merchants.response.interface";

@injectable()
export class GetAllMerchantsUseCase {
  constructor(
    @inject("MerchantsRepository")
    private merchantsRepository: MerchantsRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllMerchantsResponse> {
    return await this.merchantsRepository.getAll(
      token,
      paginationParams,
      filters
    );
  }
}
