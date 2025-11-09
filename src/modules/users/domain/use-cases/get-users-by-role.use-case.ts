import { inject, injectable } from "inversify";
import type { UserRole } from "@/data/interfaces/user.interface";
import type { UsersRepository } from "../../data/repositories/users.repository";
import type { AllUsersResponse } from "../../data/interfaces/users.response.interface";

@injectable()
export class GetUsersByRoleUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: UsersRepository
  ) {}

  async execute(roleName: UserRole, token?: string): Promise<AllUsersResponse> {
    return await this.usersRepository.getByRole(roleName, token);
  }
}
