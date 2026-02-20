import { inject, injectable } from "inversify";
import type { GiftsRepository } from "../../data/repositories/gifts.repository";

@injectable()
export class DeleteGiftUseCase {
  constructor(
    @inject("GiftsRepository")
    private giftsRepository: GiftsRepository
  ) {}

  async execute(giftId: number, token?: string): Promise<{ message: string }> {
    return await this.giftsRepository.delete(giftId, token);
  }
}
