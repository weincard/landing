export type UserRole = "superadmin" | "client" | "owner" | "manager" | "staff";

export interface IUser {
  id?: string;
  idUsuario?: number; // Int (autoincremental) - PK
  name: string; // Varchar(50) - Nombre del usuario
  lastName: string; // Varchar(50) - Apellido del usuario
  email: string; // Varchar(250) - Correo electrónico del usuario
  password?: string; // Varchar(250) - Contraseña del usuario
  phone: string; // Varchar(250) - Teléfono del usuario
  verificationCode?: string;
  isVerified?: boolean;
  role?: UserRole; // Enum de tipos de usuario
  createdAt?: Date; // DateTime - Fecha de registro del usuario
}
