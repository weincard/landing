import "reflect-metadata";
import { Container } from "inversify";
import { AxiosHttpClient, HttpClient } from "@/config/protocols/http";
import {
  AuthRepository,
  AuthRepositoryImpl,
} from "@/modules/auth/data/repositories/auth.repository";
import {
  UsersRepository,
  UsersRepositoryImpl,
} from "@/modules/users/data/repositories/users.repository";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import {
  LocalStorageProtocol,
  LocalStorageProtocolImpl,
} from "@/config/protocols/cache/local_cache";

const container = new Container();

// const TYPES = {
//     HttpClient: Symbol.for("HttpClient"),
//     AuthRepository: Symbol.for("AuthRepository"),
//     UsersRepository: Symbol.for("UsersRepository"),
// };

container.bind(HttpClient).to(AxiosHttpClient).inSingletonScope();
container.bind(AuthRepository).to(AuthRepositoryImpl).inSingletonScope();
container.bind("UsersRepository").to(UsersRepositoryImpl).inSingletonScope();
container.bind(GetAllUsersUseCase).toSelf().inSingletonScope();
container.bind(CreateUserUseCase).toSelf().inSingletonScope();
container
  .bind(LocalStorageProtocol)
  .to(LocalStorageProtocolImpl)
  .inSingletonScope();

export default container;
