import { inject, injectable } from "inversify";
import type { UsersRepository } from "../../data/repositories/users.repository";
import type { UserResponse } from "../../data/interfaces/users.response.interface";

@injectable()
export class DeactivateAccountUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: UsersRepository
  ) {}

  async execute(token?: string): Promise<UserResponse> {
    return await this.usersRepository.deactivateAccount(token);
  }
}
