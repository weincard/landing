import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllBranchesUseCase } from "../use-cases/get-all-branches.use-case";
import { GetOneBranchUseCase } from "../use-cases/get-one-branch.use-case";
import { CreateBranchUseCase } from "../use-cases/create-branch.use-case";
import { UpdateBranchUseCase } from "../use-cases/update-branch.use-case";
import { DeleteBranchUseCase } from "../use-cases/delete-branch.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllBranchesResponse,
  BranchResponse,
} from "../../data/interfaces/branches.response.interface";
import type { IBranch } from "@/data/interfaces/merchant.interface";

export const useBranches = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllBranches = useCallback(
    async (
      merchantId?: number,
      token?: string,
      paginationParams?: IPaginationParams,
      filters?: { name?: string }
    ): Promise<AllBranchesResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllBranchesUseCase = container.get(GetAllBranchesUseCase);
        const response = await getAllBranchesUseCase.execute(
          merchantId,
          token,
          paginationParams,
          filters
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar sucursales";
        setError(errorMessage);
        console.error("Error getting branches:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getOneBranch = useCallback(
    async (
      branchId: number,
      token?: string
    ): Promise<BranchResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getOneBranchUseCase = container.get(GetOneBranchUseCase);
        const response = await getOneBranchUseCase.execute(branchId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar sucursal";
        setError(errorMessage);
        console.error("Error getting branch:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createBranch = useCallback(
    async (
      branchData: Partial<IBranch>,
      logoFile?: File,
      imageFiles?: File[],
      token?: string
    ): Promise<BranchResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createBranchUseCase = container.get(CreateBranchUseCase);
        const response = await createBranchUseCase.execute(
          branchData,
          logoFile,
          imageFiles,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear sucursal";
        setError(errorMessage);
        console.error("Error creating branch:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBranch = useCallback(
    async (
      branchId: number,
      branchData: Partial<IBranch>,
      logoFile?: File | null,
      imageFiles?: File[],
      token?: string
    ): Promise<BranchResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateBranchUseCase = container.get(UpdateBranchUseCase);
        const response = await updateBranchUseCase.execute(
          branchId,
          branchData,
          logoFile,
          imageFiles,
          token
        );
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar sucursal";
        setError(errorMessage);
        console.error("Error updating branch:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteBranch = useCallback(
    async (
      branchId: number,
      token?: string
    ): Promise<{ message: string } | null> => {
      setLoading(true);
      setError(null);

      try {
        const deleteBranchUseCase = container.get(DeleteBranchUseCase);
        const response = await deleteBranchUseCase.execute(branchId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al eliminar sucursal";
        setError(errorMessage);
        console.error("Error deleting branch:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllBranches,
    getOneBranch,
    createBranch,
    updateBranch,
    deleteBranch,
    loading,
    error,
  };
};
