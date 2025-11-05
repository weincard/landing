import { inject, injectable } from "inversify";
import type { OffersRepository } from "../../data/repositories/offers.repository";
import type { OfferResponse } from "../../data/interfaces/offers.response.interface";

@injectable()
export class GetOneOfferUseCase {
  constructor(
    @inject("OffersRepository")
    private offersRepository: OffersRepository
  ) {}

  async execute(offerId: number, token?: string): Promise<OfferResponse> {
    return await this.offersRepository.getOne(offerId, token);
  }
}
