import { inject, injectable } from "inversify";
import type { GiftsRepository } from "../../data/repositories/gifts.repository";
import type { GiftResponse } from "../../data/interfaces/gifts.response.interface";
import type { IGift } from "@/data/interfaces/gift.interface";

@injectable()
export class UpdateGiftUseCase {
  constructor(
    @inject("GiftsRepository")
    private giftsRepository: GiftsRepository
  ) {}

  async execute(
    giftId: number,
    giftData: Partial<IGift>,
    token?: string
  ): Promise<GiftResponse> {
    return await this.giftsRepository.update(giftId, giftData, token);
  }
}
