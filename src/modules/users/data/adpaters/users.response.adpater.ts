import type { IUser } from "@/data/interfaces/user.interface";
import type {
  AllUsersResponse,
  ApiAllUsersResponse,
  CreateUserResponse,
  DeleteUserResponse,
  UserResponse,
  UpdateUserResponse,
} from "../interfaces/users.response.interface";

export const createUserResponseAdapter = (
  response: CreateUserResponse | any
): UserResponse => ({
  message: response.message,
  user: response.user ? mapearUsuario(response.user) : undefined,
});

export const updateUserResponseAdapter = (
  response: UpdateUserResponse | any
): UserResponse => ({
  message: response.message,
  user: response.user ? mapearUsuario(response.user) : undefined,
});

export const deleteUserResponseAdapter = (
  response: DeleteUserResponse | any
): UserResponse => ({
  message: response.message,
  user: response.user ? mapearUsuario(response.user) : undefined,
});

export const allUsersResponseAdapter = (
  response: ApiAllUsersResponse | any
): AllUsersResponse => ({
  count: response.count,
  users: response.users.map((user: any) => mapearUsuario(user)),
});

function mapearUsuario(user: any): IUser {
  return {
    id: user.userId?.toString(),
    idUsuario: user.userId,
    name: user.name || user.firstName || "",
    lastName: user.lastName || user.apellido || "",
    email: user.email || "",
    phone: user.phone || "",
    document: user.document || "",
    documentType: user.documentType || "CC",
    role: user.role?.name || user.role || "client",
    verificationCode: user.verificationCode || "",
    isVerified: user.isVerified || false,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
  };
}
