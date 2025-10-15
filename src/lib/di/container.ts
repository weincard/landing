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
import {
  MerchantsRepository,
  MerchantsRepositoryImpl,
} from "@/modules/merchants/data/repositories/merchants.repository";
import {
  BranchesRepository,
  BranchesRepositoryImpl,
} from "@/modules/branches/data/repositories/branches.repository";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import { GetAllMerchantsUseCase } from "@/modules/merchants/domain/use-cases/get-all-merchants.use-case";
import { CreateMerchantUseCase } from "@/modules/merchants/domain/use-cases/create-merchant.use-case";
import { GetAllBranchesUseCase } from "@/modules/branches/domain/use-cases/get-all-branches.use-case";
import { GetOneBranchUseCase } from "@/modules/branches/domain/use-cases/get-one-branch.use-case";
import { CreateBranchUseCase } from "@/modules/branches/domain/use-cases/create-branch.use-case";
import { UpdateBranchUseCase } from "@/modules/branches/domain/use-cases/update-branch.use-case";
import {
  LocalStorageProtocol,
  LocalStorageProtocolImpl,
} from "@/config/protocols/cache/local_cache";

const container = new Container();

// const TYPES = {
//     HttpClient: Symbol.for("HttpClient"),
//     AuthRepository: Symbol.for("AuthRepository"),
//     UsersRepository: Symbol.for("UsersRepository"),
//     MerchantsRepository: Symbol.for("MerchantsRepository"),
// };

container.bind(HttpClient).to(AxiosHttpClient).inSingletonScope();
container.bind(AuthRepository).to(AuthRepositoryImpl).inSingletonScope();
container.bind("UsersRepository").to(UsersRepositoryImpl).inSingletonScope();
container
  .bind("MerchantsRepository")
  .to(MerchantsRepositoryImpl)
  .inSingletonScope();
container
  .bind("BranchesRepository")
  .to(BranchesRepositoryImpl)
  .inSingletonScope();
container.bind(GetAllUsersUseCase).toSelf().inSingletonScope();
container.bind(CreateUserUseCase).toSelf().inSingletonScope();
container.bind(GetAllMerchantsUseCase).toSelf().inSingletonScope();
container.bind(CreateMerchantUseCase).toSelf().inSingletonScope();
container.bind(GetAllBranchesUseCase).toSelf().inSingletonScope();
container.bind(GetOneBranchUseCase).toSelf().inSingletonScope();
container.bind(CreateBranchUseCase).toSelf().inSingletonScope();
container.bind(UpdateBranchUseCase).toSelf().inSingletonScope();
container
  .bind(LocalStorageProtocol)
  .to(LocalStorageProtocolImpl)
  .inSingletonScope();

export default container;
