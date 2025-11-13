import { IUser } from "../interfaces/user.interface";

export const userAdapter = (user: any): IUser => ({
  id: user.userId,
  name: user.firstName, // Varchar(50) - Nombre del usuario
  lastName: user.lastName, // Varchar(50) - Apellido del usuario
  email: user.email, // Varchar(250) - Correo electrónico del usuario
  phone: user.phone, // Varchar(250) - Teléfono del usuario
  role: user.role,
  address: user.address || "", // Dirección del usuario
  document: user.document || "", // Número de documento
  documentType: user.documentType || undefined, // Tipo de documento
  country: user.country || "", // País del usuario
  department: user.department || "", // Departamento del usuario
  city: user.city || "", // Ciudad del usuario
  profileUrl: user.profileUrl || "", // URL de la foto de perfil
  isVerified: user.isVerified || false, // Indica si el usuario está verificado
  createdAt: new Date(user.createdAt), // DateTime - Fecha de registro del usuario
});
