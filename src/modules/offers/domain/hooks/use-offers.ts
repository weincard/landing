import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllOffersUseCase } from "../use-cases/get-all-offers.use-case";
import { GetOneOfferUseCase } from "../use-cases/get-one-offer.use-case";
import { CreateOfferUseCase } from "../use-cases/create-offer.use-case";
import { UpdateOfferUseCase } from "../use-cases/update-offer.use-case";
import { DeleteOfferUseCase } from "../use-cases/delete-offer.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllOffersResponse,
  OfferResponse,
  CreateOfferRequest,
  UpdateOfferRequest,
} from "../../data/interfaces/offers.response.interface";

export const useOffers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllOffers = useCallback(
    async (
      branchId?: string,
      token?: string,
      paginationParams?: IPaginationParams
    ): Promise<AllOffersResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllOffersUseCase = container.get(GetAllOffersUseCase);
        const response = await getAllOffersUseCase.execute(
          branchId,
          token,
          paginationParams
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar ofertas";
        setError(errorMessage);
        console.error("Error getting offers:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getOneOffer = useCallback(
    async (offerId: number, token?: string): Promise<OfferResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getOneOfferUseCase = container.get(GetOneOfferUseCase);
        const response = await getOneOfferUseCase.execute(offerId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar oferta";
        setError(errorMessage);
        console.error("Error getting offer:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createOffer = useCallback(
    async (
      offerData: CreateOfferRequest,
      token?: string
    ): Promise<OfferResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createOfferUseCase = container.get(CreateOfferUseCase);
        const response = await createOfferUseCase.execute(offerData, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear oferta";
        setError(errorMessage);
        console.error("Error creating offer:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateOffer = useCallback(
    async (
      offerId: number,
      offerData: UpdateOfferRequest,
      token?: string
    ): Promise<OfferResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateOfferUseCase = container.get(UpdateOfferUseCase);
        const response = await updateOfferUseCase.execute(
          offerId,
          offerData,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar oferta";
        setError(errorMessage);
        console.error("Error updating offer:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteOffer = useCallback(
    async (
      offerId: number,
      token?: string
    ): Promise<{ message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const deleteOfferUseCase = container.get(DeleteOfferUseCase);
        const response = await deleteOfferUseCase.execute(offerId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al eliminar oferta";
        setError(errorMessage);
        console.error("Error deleting offer:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllOffers,
    getOneOffer,
    createOffer,
    updateOffer,
    deleteOffer,
    loading,
    error,
  };
};
