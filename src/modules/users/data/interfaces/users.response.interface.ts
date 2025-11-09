import type { IUser } from "@/data/interfaces/user.interface";

/**
 * Interfaz para la respuesta de obtener todos los usuarios
 */
export interface AllUsersResponse {
  count?: number;
  users: IUser[];
}

/**
 * Interfaz para la respuesta de operaciones CRUD individuales (crear, actualizar, eliminar)
 */
export interface UserResponse {
  id?: number;
  message: string;
  user?: IUser;
}

/**
 * Interfaz para la respuesta de la API al registrar un usuario
 */
export interface CreateUserApiResponse {
  message?: string;
  user?: {
    userId: number;
    name?: string;
    email?: string;
    phone?: string;
    documentType?: "CC" | "NIT";
    document?: string;
    country?: string;
    department?: string;
    city?: string;
    profileUrl?: string;
    isVerified: boolean;
    createdAt: string;
    role: {
      roleId: number;
      name: string;
    };
  };
}

/**
 * Interfaz para la respuesta de la API al actualizar un usuario
 */
export interface UpdateUserApiResponse {
  message?: string;
  user?: {
    userId: number;
    email?: string;
    phone?: string;
    document?: string;
    documentType?: "CC" | "NIT";
    isVerified: boolean;
    createdAt: string;
    role: {
      roleId: number;
      name: string;
    };
  };
}

/**
 * Interfaz para la respuesta de obtener todos los usuarios con la nueva estructura de la API
 */
export interface ApiAllUsersResponse {
  count: number;
  users: Array<{
    userId: number;
    phone?: string;
    email?: string;
    document?: string;
    documentType?: "CC" | "NIT";
    isVerified: boolean;
    createdAt: string;
    role: {
      roleId: number;
      name: string;
    };
  }>;
}

/**
 * Interfaz para la respuesta de obtener un usuario por ID
 */
export interface GetUserByIdApiResponse {
  userId: number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  isVerified: boolean;
  createdAt: string;
}

/**
 * Interfaz para la respuesta de obtener usuarios por rol
 */
export interface GetUsersByRoleApiResponse {
  users: Array<{
    userId: number;
    phone?: string;
    email?: string;
    document?: string;
    documentType?: "CC" | "NIT";
    isVerified: boolean;
    createdAt: string;
    role: {
      roleId: number;
      name: string;
    };
  }>;
}
