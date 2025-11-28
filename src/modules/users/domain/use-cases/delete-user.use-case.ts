import { inject, injectable } from "inversify";
import { UsersRepository } from "../../data/repositories/users.repository";
import type { UserResponse } from "../../data/interfaces/users.response.interface";

@injectable()
export class DeleteUserUseCase {
  constructor(@inject("UsersRepository") private repository: UsersRepository) {}

  async execute(userId: number, token?: string): Promise<UserResponse> {
    return await this.repository.delete(userId, token);
  }
}
