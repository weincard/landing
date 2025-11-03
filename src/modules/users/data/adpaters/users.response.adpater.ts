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

export const getUserByIdResponseAdapter = (response: any): UserResponse => {
  console.log("getUserByIdResponseAdapter - Input response:", response);
  const result = {
    message: "Usuario obtenido exitosamente",
    user: response.user ? mapearUsuario(response.user) : undefined,
  };
  console.log("getUserByIdResponseAdapter - Output result:", result);
  return result;
};

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
  console.log("mapearUsuario - Input user:", user);

  // Extraer la parte antes del @ del email como name si no hay name
  const nameFromEmail = user.email ? user.email.split("@")[0] : "";

  const mappedUser = {
    id: user.userId?.toString(),
    idUsuario: user.userId,
    name: user.name || user.firstName || nameFromEmail || "Usuario",
    lastName: user.lastName || user.lastname || user.apellido || "",
    email: user.email || "",
    phone: user.phone || "",
    document: user.document || "",
    documentType: user.documentType || "CC",
    role: user.role?.name || user.role || "client", // Manejar role como objeto o string
    verificationCode: user.verificationCode || "",
    isVerified: user.isVerified || false,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
  };

  console.log("mapearUsuario - Output mappedUser:", mappedUser);
  return mappedUser;
}
