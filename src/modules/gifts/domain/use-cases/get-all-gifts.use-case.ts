import { inject, injectable } from "inversify";
import type { GiftsRepository } from "../../data/repositories/gifts.repository";
import type { AllGiftsResponse } from "../../data/interfaces/gifts.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetAllGiftsUseCase {
  constructor(
    @inject("GiftsRepository")
    private giftsRepository: GiftsRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { search?: string; isActive?: boolean }
  ): Promise<AllGiftsResponse> {
    return await this.giftsRepository.getAll(
      token,
      paginationParams,
      filters
    );
  }
}
