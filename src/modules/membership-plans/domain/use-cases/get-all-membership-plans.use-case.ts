import { injectable, inject } from "inversify";
import { MembershipPlansRepository } from "../../data/repositories/membership-plans.repository";
import { IMembershipPlan } from "@/data/interfaces/membership-plan.interface";

@injectable()
export class GetAllMembershipPlansUseCase {
  constructor(
    @inject(MembershipPlansRepository)
    private membershipPlansRepository: MembershipPlansRepository
  ) {}

  async execute(token: string): Promise<IMembershipPlan[]> {
    const response = await this.membershipPlansRepository.getAll(token);
    return response.membershipPlans || [];
  }
}
