import { inject, injectable } from "inversify";
import type { OffersRepository } from "../../data/repositories/offers.repository";

@injectable()
export class DeleteOfferUseCase {
  constructor(
    @inject("OffersRepository")
    private offersRepository: OffersRepository
  ) {}

  async execute(offerId: number, token?: string): Promise<{ message: string }> {
    return await this.offersRepository.delete(offerId, token);
  }
}
