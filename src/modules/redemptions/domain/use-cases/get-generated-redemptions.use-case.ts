import { inject, injectable } from "inversify";
import type { RedemptionsRepository } from "../../data/repositories/redemptions.repository";
import type { GeneratedRedemptionsResponse } from "../../data/interfaces/redemptions.response.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";

@injectable()
export class GetGeneratedRedemptionsUseCase {
    constructor(
        @inject("RedemptionsRepository")
        private redemptionsRepository: RedemptionsRepository
    ) { }

    async execute(
        token?: string,
        paginationParams?: IPaginationParams,
        filters?: { branchId?: number | null; userId?: number | null }
    ): Promise<GeneratedRedemptionsResponse> {
        return await this.redemptionsRepository.getGenerated(
            token,
            paginationParams,
            filters
        );
    }
}
