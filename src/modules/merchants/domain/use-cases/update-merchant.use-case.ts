import { inject, injectable } from "inversify";
import { MerchantsRepository } from "../../data/repositories/merchants.repository";
import type { MerchantResponse } from "../../data/interfaces/merchants.response.interface";
import type { IMerchant } from "@/data/interfaces/merchant.interface";

@injectable()
export class UpdateMerchantUseCase {
  constructor(
    @inject("MerchantsRepository")
    private merchantsRepository: MerchantsRepository
  ) {}

  async execute(
    merchantId: number,
    merchantData: Partial<IMerchant>,
    logoFile?: File | null,
    token?: string
  ): Promise<MerchantResponse> {
    return await this.merchantsRepository.update(
      merchantId,
      merchantData,
      logoFile,
      token
    );
  }
}
