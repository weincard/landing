import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllRedemptionsUseCase } from "../use-cases/get-all-redemptions.use-case";
import { GetMyRedemptionsUseCase } from "../use-cases/get-my-redemptions.use-case";
import { CreateRedemptionUseCase } from "../use-cases/create-redemption.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllRedemptionsResponse,
  RedemptionResponse,
  CreateRedemptionRequest,
} from "../../data/interfaces/redemptions.response.interface";

export const useRedemptions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllRedemptions = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { branchId?: number | null; userId?: number | null }
    ): Promise<AllRedemptionsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllRedemptionsUseCase = container.get(
          GetAllRedemptionsUseCase
        );
        const response = await getAllRedemptionsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar redenciones";
        setError(errorMessage);
        console.error("Error getting redemptions:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMyRedemptions = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams
    ): Promise<AllRedemptionsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getMyRedemptionsUseCase = container.get(GetMyRedemptionsUseCase);
        const response = await getMyRedemptionsUseCase.execute(
          token,
          paginationParams
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar mis redenciones";
        setError(errorMessage);
        console.error("Error getting my redemptions:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createRedemption = useCallback(
    async (
      redemptionData: CreateRedemptionRequest,
      token?: string
    ): Promise<RedemptionResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createRedemptionUseCase = container.get(CreateRedemptionUseCase);
        const response = await createRedemptionUseCase.execute(
          redemptionData,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear redención";
        setError(errorMessage);
        console.error("Error creating redemption:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllRedemptions,
    getMyRedemptions,
    createRedemption,
    loading,
    error,
  };
};
