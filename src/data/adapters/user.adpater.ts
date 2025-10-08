import { IUser } from "../interfaces/user.interface";

export const userAdapter = (user: any): IUser => ({
  id: user.userId,
  name: user.firstName, // Varchar(50) - Nombre del usuario
  lastName: user.lastName, // Varchar(50) - Apellido del usuario
  email: user.email, // Varchar(250) - Correo electrónico del usuario
  phone: user.phone, // Varchar(250) - Teléfono del usuario
  role: user.role,
  createdAt: new Date(user.createdAt), // DateTime - Fecha de registro del usuario
});
