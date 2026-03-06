import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type { UsedRedemptionsResponse } from "../../data/interfaces/redemptions.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetUsedRedemptionsUseCase {
    constructor(
        @inject("RedemptionsRepository")
        private redemptionsRepository: RedemptionsRepository
    ) { }

    async execute(
        token?: string,
        paginationParams?: IPaginationParams,
        filters?: { branchId?: number | null; userId?: number | null }
    ): Promise<UsedRedemptionsResponse> {
        return await this.redemptionsRepository.getUsed(
            token,
            paginationParams,
            filters
        );
    }
}
