import type { IUser } from "@/data/interfaces/user.interface";
import type {
  AllUsersResponse,
  ApiAllUsersResponse,
  CreateUserApiResponse,
  UpdateUserApiResponse,
  UserResponse,
  GetUserByIdApiResponse,
  GetUsersByRoleApiResponse,
} from "../interfaces/users.response.interface";

export const createUserResponseAdapter = (
  response: CreateUserApiResponse | any
): UserResponse => ({
  message: response.message || "Usuario creado exitosamente",
  user: response.user ? mapearUsuario(response.user) : undefined,
});

export const getUserByIdResponseAdapter = (
  response: GetUserByIdApiResponse | any
): UserResponse => {
  console.log("getUserByIdResponseAdapter - Input response:", response);
  const result = {
    message: "Usuario obtenido exitosamente",
    user: response?.user ? mapearUsuario(response.user) : undefined,
  };
  console.log("getUserByIdResponseAdapter - Output result:", result);
  return result;
};

export const updateUserResponseAdapter = (
  response: UpdateUserApiResponse | any
): UserResponse => ({
  message: response.message || "Usuario actualizado exitosamente",
  user: response.user ? mapearUsuario(response.user) : undefined,
});

export const allUsersResponseAdapter = (
  response: ApiAllUsersResponse | any
): AllUsersResponse => ({
  count: response.count,
  users: response.users.map((user: any) => mapearUsuario(user)),
});

export const getUsersByRoleResponseAdapter = (
  response: GetUsersByRoleApiResponse | any
): AllUsersResponse => ({
  count: response.users?.length || 0,
  users: response.users?.map((user: any) => mapearUsuario(user)) || [],
});

function mapearUsuario(user: any): IUser {
  // console.log("mapearUsuario - Input user:", user);

  // Extraer la parte antes del @ del email como name si no hay name
  const nameFromEmail = user.email ? user.email.split("@")[0] : "";

  const mappedUser: IUser = {
    id: user.userId?.toString(),
    userId: user.userId,
    idUsuario: user.userId, // Para compatibilidad
    name: user.name || user.firstName || nameFromEmail || "Usuario",
    email: user.email || "",
    phone: user.phone || "",
    document: user.document || "",
    documentType: user.documentType || "CC",
    country: user.country || "",
    department: user.department || "",
    city: user.city || "",
    address: user.address || "",
    profileUrl: user.profileUrl || "",
    role: user.role?.name || user.role || "client", // Manejar role como objeto o string
    verificationCode: user.verificationCode || "",
    isVerified: user.isVerified || false,
    createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
  };

  // console.log("mapearUsuario - Output mappedUser:", mappedUser);
  return mappedUser;
}
