import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllRedemptionsUseCase } from "../use-cases/get-all-redemptions.use-case";
import { GetMyRedemptionsUseCase } from "../use-cases/get-my-redemptions.use-case";
import { CreateRedemptionUseCase } from "../use-cases/create-redemption.use-case";
import { GetGeneratedRedemptionsUseCase } from "../use-cases/get-generated-redemptions.use-case";
import { GetUsedRedemptionsUseCase } from "../use-cases/get-used-redemptions.use-case";
import { GetRedemptionMetricsUseCase } from "../use-cases/get-redemption-metrics.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllRedemptionsResponse,
  RedemptionResponse,
  CreateRedemptionRequest,
  GeneratedRedemptionsResponse,
  UsedRedemptionsResponse,
  RedemptionMetricsResponse
} from "../../data/interfaces/redemptions.response.interface";

export const useRedemptions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMetrics = useCallback(
    async (token?: string): Promise<RedemptionMetricsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getRedemptionMetricsUseCase = container.get(
          GetRedemptionMetricsUseCase
        );
        const response = await getRedemptionMetricsUseCase.execute(token);
        return response;
      } catch (err: any) {
        const errorMessage =
          err?.message || "Error al cargar métricas de redenciones";
        setError(errorMessage);
        console.error("Error getting redemption metrics:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAllRedemptions = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { branchId?: number | null; userId?: number | null; branchName?: string; userName?: string }
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

  const getGeneratedRedemptions = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { branchId?: number | null; userId?: number | null; branchName?: string; userName?: string }
    ): Promise<GeneratedRedemptionsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getGeneratedRedemptionsUseCase = container.get(
          GetGeneratedRedemptionsUseCase
        );
        const response = await getGeneratedRedemptionsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar códigos generados";
        setError(errorMessage);
        console.error("Error getting generated redemptions:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUsedRedemptions = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { branchId?: number | null; userId?: number | null; branchName?: string; userName?: string }
    ): Promise<UsedRedemptionsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getUsedRedemptionsUseCase = container.get(
          GetUsedRedemptionsUseCase
        );
        const response = await getUsedRedemptionsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar códigos usados";
        setError(errorMessage);
        console.error("Error getting used redemptions:", err);
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
    getGeneratedRedemptions,
    getUsedRedemptions,
    getMyRedemptions,
    createRedemption,
    getMetrics,
    loading,
    error,
  };
};
