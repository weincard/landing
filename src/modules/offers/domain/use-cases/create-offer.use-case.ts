import { inject, injectable } from "inversify";
import type { OffersRepository } from "../../data/repositories/offers.repository";
import type {
  OfferResponse,
  CreateOfferRequest,
} from "../../data/interfaces/offers.response.interface";

@injectable()
export class CreateOfferUseCase {
  constructor(
    @inject("OffersRepository")
    private offersRepository: OffersRepository
  ) {}

  async execute(
    offerData: CreateOfferRequest,
    token?: string
  ): Promise<OfferResponse> {
    return await this.offersRepository.create(offerData, token);
  }
}
