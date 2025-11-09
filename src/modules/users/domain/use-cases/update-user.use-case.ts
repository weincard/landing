import { inject, injectable } from "inversify";
import { UsersRepository } from "../../data/repositories/users.repository";
import type { UserResponse } from "../../data/interfaces/users.response.interface";
import type {
  IUser,
  IUpdateUserRequest,
} from "@/data/interfaces/user.interface";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: UsersRepository
  ) {}

  async execute(
    userParams: IUpdateUserRequest | IUser,
    token?: string
  ): Promise<UserResponse> {
    return await this.usersRepository.update(userParams, token);
  }
}
