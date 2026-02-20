import { inject, injectable } from "inversify";
import type { GiftsRepository } from "../../data/repositories/gifts.repository";
import type { GiftResponse } from "../../data/interfaces/gifts.response.interface";

@injectable()
export class GetOneGiftUseCase {
  constructor(
    @inject("GiftsRepository")
    private giftsRepository: GiftsRepository
  ) {}

  async execute(giftId: number, token?: string): Promise<GiftResponse> {
    return await this.giftsRepository.getOne(giftId, token);
  }
}
