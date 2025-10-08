import type { IUser } from "@/data/interfaces/user.interface"

/**
 * Interfaz para la respuesta de obtener todos los usuarios
 */
export interface AllUsersResponse {
  count?: number
  users: IUser[]
}

/**
 * Interfaz para la respuesta de operaciones CRUD individuales (crear, actualizar, eliminar)
 */
export interface UserResponse {
  id?: number
  message: string
  user?: IUser
}

/**
 * Interfaz para la respuesta de la API con la estructura original
 */
export interface UpdateUserResponse {
  message?: string
  user?: {
    userId: number
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
    phone: string
    role: string
    verificationCode: string | null
    isVerified: boolean
    createdAt: string
  }
}

export interface CreateUserResponse {
  message?: string
  user?: {
    userId: number
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
    phone: string
    role: string
    verificationCode: string | null
    isVerified: boolean
    createdAt: string
  }
}

/**
 * Interfaz para la respuesta de obtener todos los usuarios con la estructura original
 */
export interface ApiAllUsersResponse {
  users: Array<{
    userId: number
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
    phone: string
    role: string
    verificationCode: string | null
    isVerified: boolean
    createdAt: string
  }>
  count: number
}

/**
 * Interfaz para la respuesta de eliminar un usuario con la estructura original
 */
export interface DeleteUserResponse {
  message?: string
  user?: {
    userId: number
    firstName: string | null
    lastName: string | null
    email: string | null
    password: string | null
    phone: string
    role: string
    verificationCode: string | null
    isVerified: boolean
    createdAt: string
  }
}
