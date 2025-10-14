import { inject, injectable } from "inversify";
import type { MerchantsRepository } from "../../data/repositories/merchants.repository";
import type { MerchantResponse } from "../../data/interfaces/merchants.response.interface";
import type { IMerchant } from "@/data/interfaces/merchant.interface";

@injectable()
export class CreateMerchantUseCase {
  constructor(
    @inject("MerchantsRepository")
    private merchantsRepository: MerchantsRepository
  ) {}

  async execute(
    merchantData: Partial<IMerchant>,
    logoFile?: File,
    token?: string
  ): Promise<MerchantResponse> {
    return await this.merchantsRepository.create(merchantData, logoFile, token);
  }
}
