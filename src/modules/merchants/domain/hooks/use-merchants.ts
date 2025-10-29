import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllMerchantsUseCase } from "../use-cases/get-all-merchants.use-case";
import { CreateMerchantUseCase } from "../use-cases/create-merchant.use-case";
import { GetMerchantByIdUseCase } from "../use-cases/get-merchant-by-id.use-case";
import { UpdateMerchantUseCase } from "../use-cases/update-merchant.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllMerchantsResponse,
  MerchantResponse,
} from "../../data/interfaces/merchants.response.interface";
import type { IMerchant } from "@/data/interfaces/merchant.interface";

export const useMerchants = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllMerchants = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { name?: string }
    ): Promise<AllMerchantsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllMerchantsUseCase = container.get(GetAllMerchantsUseCase);
        const response = await getAllMerchantsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar merchants";
        setError(errorMessage);
        console.error("Error getting merchants:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createMerchant = useCallback(
    async (
      merchantData: Partial<IMerchant>,
      logoFile?: File,
      token?: string
    ): Promise<MerchantResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createMerchantUseCase = container.get(CreateMerchantUseCase);
        const response = await createMerchantUseCase.execute(
          merchantData,
          logoFile,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear merchant";
        setError(errorMessage);
        console.error("Error creating merchant:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMerchantById = useCallback(
    async (
      merchantId: number,
      token?: string
    ): Promise<MerchantResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getMerchantByIdUseCase = container.get(GetMerchantByIdUseCase);
        const response = await getMerchantByIdUseCase.execute(
          merchantId,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar merchant";
        setError(errorMessage);
        console.error("Error getting merchant:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateMerchant = useCallback(
    async (
      merchantId: number,
      merchantData: Partial<IMerchant>,
      logoFile?: File,
      token?: string
    ): Promise<MerchantResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateMerchantUseCase = container.get(UpdateMerchantUseCase);
        const response = await updateMerchantUseCase.execute(
          merchantId,
          merchantData,
          logoFile,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar merchant";
        setError(errorMessage);
        console.error("Error updating merchant:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllMerchants,
    getMerchantById,
    createMerchant,
    updateMerchant,
    loading,
    error,
  };
};
