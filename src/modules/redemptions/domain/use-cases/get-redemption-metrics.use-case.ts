import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type { RedemptionMetricsResponse } from "../../data/interfaces/redemptions.response.interface";

@injectable()
export class GetRedemptionMetricsUseCase {
  constructor(
    @inject("RedemptionsRepository")
    private redemptionsRepository: RedemptionsRepository
  ) {}

  async execute(token?: string): Promise<RedemptionMetricsResponse> {
    return await this.redemptionsRepository.getMetrics(token);
  }
}
