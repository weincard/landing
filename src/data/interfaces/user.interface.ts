export interface IUser {
  id?: string;
  idUsuario?: number; // Int (autoincremental) - PK
  nombre: string; // Varchar(50) - Nombre del usuario
  apellido: string; // Varchar(50) - Apellido del usuario
  email: string; // Varchar(250) - Correo electrónico del usuario
  contrasena?: string; // Varchar(250) - Contraseña del usuario
  telefono: string; // Varchar(250) - Teléfono del usuario
  codigoVerificacion?: string;
  estaVerificado?: boolean;
  role?: string; // Enum de tipos de usuario
  creadoEn?: Date; // DateTime - Fecha de registro del usuario
}
