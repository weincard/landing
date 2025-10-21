import { useState } from "react";
import container from "@/lib/di/container";
import { IMembershipPlan } from "@/data/interfaces/membership-plan.interface";
import { GetAllMembershipPlansUseCase } from "../use-cases/get-all-membership-plans.use-case";
import { GetOneMembershipPlanUseCase } from "../use-cases/get-one-membership-plan.use-case";

export const useMembershipPlans = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllMembershipPlans = async (
    token: string
  ): Promise<IMembershipPlan[]> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(GetAllMembershipPlansUseCase);
      const plans = await useCase.execute(token);
      return plans;
    } catch (err: any) {
      setError(err.message || "Error al obtener los planes de membresía");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOneMembershipPlan = async (
    membershipPlanId: number,
    token: string
  ): Promise<IMembershipPlan> => {
    setLoading(true);
    setError(null);
    try {
      const useCase = container.get(GetOneMembershipPlanUseCase);
      const plan = await useCase.execute(membershipPlanId, token);
      return plan;
    } catch (err: any) {
      setError(err.message || "Error al obtener el plan de membresía");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllMembershipPlans,
    getOneMembershipPlan,
  };
};
