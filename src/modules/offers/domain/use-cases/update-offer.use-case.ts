import { inject, injectable } from "inversify";
import type { OffersRepository } from "../../data/repositories/offers.repository";
import type {
  OfferResponse,
  UpdateOfferRequest,
} from "../../data/interfaces/offers.response.interface";

@injectable()
export class UpdateOfferUseCase {
  constructor(
    @inject("OffersRepository")
    private offersRepository: OffersRepository
  ) {}

  async execute(
    offerId: number,
    offerData: UpdateOfferRequest,
    token?: string
  ): Promise<OfferResponse> {
    return await this.offersRepository.update(offerId, offerData, token);
  }
}
