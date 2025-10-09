import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type { UsersRepository } from "../../data/repositories/users.repository";
import type { AllUsersResponse } from "../../data/interfaces/users.response.interface";

@injectable()
export class GetAllUsersUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: UsersRepository
  ) {}

  async execute(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllUsersResponse> {
    return await this.usersRepository.getAll(token, paginationParams);
  }
}
