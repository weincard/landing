import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type {
  RedemptionResponse,
  CreateRedemptionRequest,
} from "../../data/interfaces/redemptions.response.interface";

@injectable()
export class CreateRedemptionUseCase {
  constructor(
    @inject("RedemptionsRepository")
    private redemptionsRepository: RedemptionsRepository
  ) {}

  async execute(
    redemptionData: CreateRedemptionRequest,
    token?: string
  ): Promise<RedemptionResponse> {
    return await this.redemptionsRepository.create(redemptionData, token);
  }
}
