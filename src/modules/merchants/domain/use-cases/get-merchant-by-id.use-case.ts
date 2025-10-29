import { inject, injectable } from "inversify";
import { MerchantsRepository } from "../../data/repositories/merchants.repository";
import type { MerchantResponse } from "../../data/interfaces/merchants.response.interface";

@injectable()
export class GetMerchantByIdUseCase {
  constructor(
    @inject("MerchantsRepository")
    private merchantsRepository: MerchantsRepository
  ) {}

  async execute(merchantId: number, token?: string): Promise<MerchantResponse> {
    return await this.merchantsRepository.getOne(merchantId, token);
  }
}
