import { inject, injectable } from "inversify";
import type { IUser } from "@/data/interfaces/user.interface";
import type { UsersRepository } from "../../data/repositories/users.repository";
import type { UserResponse } from "../../data/interfaces/users.response.interface";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: UsersRepository
  ) {}

  async execute(userParams: IUser): Promise<UserResponse> {
    return await this.usersRepository.create(userParams);
  }
}
