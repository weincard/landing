import { UserRole } from "@/data/interfaces/user.interface";

export interface LoginResponse {
  // user: IUser,
  // email: string,
  role: UserRole;
  accessToken: string;
}
