import { injectable, inject } from "inversify";
import { MembershipPlansRepository } from "../../data/repositories/membership-plans.repository";
import { IMembershipPlan } from "@/data/interfaces/membership-plan.interface";

@injectable()
export class GetOneMembershipPlanUseCase {
  constructor(
    @inject(MembershipPlansRepository)
    private membershipPlansRepository: MembershipPlansRepository
  ) {}

  async execute(
    membershipPlanId: number,
    token: string
  ): Promise<IMembershipPlan> {
    const response = await this.membershipPlansRepository.getOne(
      membershipPlanId,
      token
    );
    return response;
  }
}
