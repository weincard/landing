import { useCallback, useState } from "react";
import container from "@/lib/di/container";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import { GetUserByIdUseCase } from "@/modules/users/domain/use-cases/get-user-by-id.use-case";
import { UpdateUserUseCase } from "@/modules/users/domain/use-cases/update-user.use-case";
import { GetUsersByRoleUseCase } from "@/modules/users/domain/use-cases/get-users-by-role.use-case";
import { DeactivateAccountUseCase } from "@/modules/users/domain/use-cases/deactivate-account.use-case";
import { DeleteUserUseCase } from "@/modules/users/domain/use-cases/delete-user.use-case";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllUsersResponse,
  UserResponse,
} from "@/modules/users/data/interfaces/users.response.interface";
import {
  UserRole,
  type IUser,
  type ICreateUserRequest,
  type IUpdateUserRequest,
} from "@/data/interfaces/user.interface";

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

  const getUsersByRole = useCallback(
    async (
      roleName: UserRole,
      token?: string
    ): Promise<AllUsersResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const getUsersByRoleUseCase = container.get(GetUsersByRoleUseCase);
        const response = await getUsersByRoleUseCase.execute(roleName, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al cargar usuarios por rol";
        setError(errorMessage);
        console.error("Error getting users by role:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createUser = useCallback(
    async (
      userParams: ICreateUserRequest | IUser,
      token?: string
    ): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const createUserUseCase = container.get(CreateUserUseCase);
        const response = await createUserUseCase.execute(userParams, token);
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
    async (
      userParams: IUpdateUserRequest | IUser,
      token?: string
    ): Promise<UserResponse | null> => {
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

  const deactivateAccount = useCallback(
    async (token?: string): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const deactivateAccountUseCase = container.get(
          DeactivateAccountUseCase
        );
        const response = await deactivateAccountUseCase.execute(token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al desactivar cuenta";
        setError(errorMessage);
        console.error("Error deactivating account:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteUser = useCallback(
    async (userId: number, token?: string): Promise<UserResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const deleteUserUseCase = container.get(DeleteUserUseCase);
        const response = await deleteUserUseCase.execute(userId, token);
        return response;
      } catch (err: any) {
        const errorMessage = err?.message || "Error al eliminar usuario";
        setError(errorMessage);
        console.error("Error deleting user:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    getAllUsers,
    getUsersByRole,
    getUserById,
    createUser,
    updateUser,
    deactivateAccount,
    deleteUser,
    loading,
    error,
  };
};
