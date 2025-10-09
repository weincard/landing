import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type { AllUsersResponse } from "@/modules/users/data/interfaces/users.response.interface";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams
    ): Promise<AllUsersResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllUsersUseCase = container.get(GetAllUsersUseCase);
        const response = await getAllUsersUseCase.execute(
          token,
          paginationParams
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar usuarios";
        setError(errorMessage);
        console.error("Error getting users:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllUsers,
    loading,
    error,
  };
};
