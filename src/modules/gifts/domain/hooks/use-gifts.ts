import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllGiftsUseCase } from "../use-cases/get-all-gifts.use-case";
import { GetOneGiftUseCase } from "../use-cases/get-one-gift.use-case";
import { CreateGiftUseCase } from "../use-cases/create-gift.use-case";
import { UpdateGiftUseCase } from "../use-cases/update-gift.use-case";
import { DeleteGiftUseCase } from "../use-cases/delete-gift.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllGiftsResponse,
  GiftResponse,
} from "../../data/interfaces/gifts.response.interface";
import type { IGift } from "@/data/interfaces/gift.interface";

export const useGifts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllGifts = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { name?: string; isActive?: boolean }
    ): Promise<AllGiftsResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllGiftsUseCase = container.get(GetAllGiftsUseCase);
        const response = await getAllGiftsUseCase.execute(
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar regalos";
        setError(errorMessage);
        console.error("Error getting gifts:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getOneGift = useCallback(
    async (
      giftId: number,
      token?: string
    ): Promise<GiftResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getOneGiftUseCase = container.get(GetOneGiftUseCase);
        const response = await getOneGiftUseCase.execute(giftId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar regalo";
        setError(errorMessage);
        console.error("Error getting gift:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createGift = useCallback(
    async (
      giftData: Partial<IGift>,
      token?: string
    ): Promise<GiftResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createGiftUseCase = container.get(CreateGiftUseCase);
        const response = await createGiftUseCase.execute(giftData, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear regalo";
        setError(errorMessage);
        console.error("Error creating gift:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateGift = useCallback(
    async (
      giftId: number,
      giftData: Partial<IGift>,
      token?: string
    ): Promise<GiftResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateGiftUseCase = container.get(UpdateGiftUseCase);
        const response = await updateGiftUseCase.execute(
          giftId,
          giftData,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar regalo";
        setError(errorMessage);
        console.error("Error updating gift:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteGift = useCallback(
    async (
      giftId: number,
      token?: string
    ): Promise<{ message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const deleteGiftUseCase = container.get(DeleteGiftUseCase);
        const response = await deleteGiftUseCase.execute(giftId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al eliminar regalo";
        setError(errorMessage);
        console.error("Error deleting gift:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllGifts,
    getOneGift,
    createGift,
    updateGift,
    deleteGift,
    loading,
    error,
  };
};
