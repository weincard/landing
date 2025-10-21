import { inject, injectable } from "inversify";
import { AuthRepository } from "../../data/repositories/auth.repository";
import type { IUser } from "@/data/interfaces/user.interface";

@injectable()
export class GetMeUseCase {
  constructor(@inject(AuthRepository) private authRepository: AuthRepository) {}

  async execute(token: string): Promise<IUser> {
    return await this.authRepository.getMe(token);
  }
}
