export type UserRole = "superadmin" | "client" | "owner" | "manager" | "staff";

export interface IUser {
  id?: string;
  userId?: number; // Int (autoincremental) - PK según la nueva API
  name?: string; // Nombre del usuario
  email?: string; // Correo electrónico del usuario
  password?: string; // Contraseña del usuario
  phone?: string; // Teléfono del usuario
  document?: string; // Número de documento
  documentType?: "CC" | "NIT"; // Tipo de documento
  country?: string; // País del usuario
  department?: string; // Departamento del usuario
  city?: string; // Ciudad del usuario
  profileUrl?: string; // URL de la foto de perfil
  verificationCode?: string;
  isVerified?: boolean;
  role?: UserRole | { roleId: number; name: string }; // Enum de tipos de usuario o objeto role
  createdAt?: Date; // DateTime - Fecha de registro del usuario

  // Campos adicionales para compatibilidad con la implementación actual
  idUsuario?: number; // Alias para userId
  lastName?: string; // Para compatibilidad con formularios existentes
}

// Interface específica para la creación/registro de usuarios
export interface ICreateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  roleName: string;
  documentType?: "CC" | "NIT";
  document?: string;
  country?: string;
  department?: string;
  city?: string;
  isVerified?: boolean;
  file?: File; // Para la foto de perfil
}

// Interface específica para la actualización de usuarios
export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  roleName?: string;
  document?: string;
  documentType?: "CC" | "NIT";
  country?: string;
  department?: string;
  city?: string;
  isVerified?: boolean;
  file?: File; // Para actualizar la foto de perfil
}
