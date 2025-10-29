import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import { GetUserByIdUseCase } from "@/modules/users/domain/use-cases/get-user-by-id.use-case";
import { UpdateUserUseCase } from "@/modules/users/domain/use-cases/update-user.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllUsersResponse,
  UserResponse,
} from "@/modules/users/data/interfaces/users.response.interface";
import { UserRole, type IUser } from "@/data/interfaces/user.interface";

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useCallback(
    async (
      token?: string,
      paginationParams?: IPaginationParams,
      role?: UserRole
    ): Promise<AllUsersResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getAllUsersUseCase = container.get(GetAllUsersUseCase);
        const response = await getAllUsersUseCase.execute(
          token,
          paginationParams,
          role
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

  const createUser = useCallback(
    async (userParams: IUser): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createUserUseCase = container.get(CreateUserUseCase);
        const response = await createUserUseCase.execute(userParams);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al crear usuario";
        setError(errorMessage);
        console.error("Error creating user:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getUserById = useCallback(
    async (userId: number, token?: string): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getUserByIdUseCase = container.get(GetUserByIdUseCase);
        const response = await getUserByIdUseCase.execute(userId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar usuario";
        setError(errorMessage);
        console.error("Error getting user:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(
    async (userParams: IUser, token?: string): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const updateUserUseCase = container.get(UpdateUserUseCase);
        const response = await updateUserUseCase.execute(userParams, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al actualizar usuario";
        setError(errorMessage);
        console.error("Error updating user:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    loading,
    error,
  };
};
