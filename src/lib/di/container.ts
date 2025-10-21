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
import {
  CouponsRepository,
  CouponsRepositoryImpl,
} from "@/modules/coupons/data/repositories/coupons.repository";
import { CategoriesRepository } from "@/modules/categories/data/repositories/categories.repository";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import { GetAllMerchantsUseCase } from "@/modules/merchants/domain/use-cases/get-all-merchants.use-case";
import { CreateMerchantUseCase } from "@/modules/merchants/domain/use-cases/create-merchant.use-case";
import { GetAllBranchesUseCase } from "@/modules/branches/domain/use-cases/get-all-branches.use-case";
import { GetOneBranchUseCase } from "@/modules/branches/domain/use-cases/get-one-branch.use-case";
import { CreateBranchUseCase } from "@/modules/branches/domain/use-cases/create-branch.use-case";
import { UpdateBranchUseCase } from "@/modules/branches/domain/use-cases/update-branch.use-case";
import { DeleteBranchUseCase } from "@/modules/branches/domain/use-cases/delete-branch.use-case";
import { GetAllCategoriesUseCase } from "@/modules/categories/domain/use-cases/get-all-categories.use-case";
import { GetOneCategoryUseCase } from "@/modules/categories/domain/use-cases/get-one-category.use-case";
import { CreateCategoryUseCase } from "@/modules/categories/domain/use-cases/create-category.use-case";
import { UpdateCategoryUseCase } from "@/modules/categories/domain/use-cases/update-category.use-case";
import { DeleteCategoryUseCase } from "@/modules/categories/domain/use-cases/delete-category.use-case";
import { GetAllCouponsUseCase } from "@/modules/coupons/domain/use-cases/get-all-coupons.use-case";
import { GetOneCouponUseCase } from "@/modules/coupons/domain/use-cases/get-one-coupon.use-case";
import { CreateCouponUseCase } from "@/modules/coupons/domain/use-cases/create-coupon.use-case";
import { UpdateCouponUseCase } from "@/modules/coupons/domain/use-cases/update-coupon.use-case";
import { DeleteCouponUseCase } from "@/modules/coupons/domain/use-cases/delete-coupon.use-case";
import { MembershipPlansRepository } from "@/modules/membership-plans/data/repositories/membership-plans.repository";
import { GetAllMembershipPlansUseCase } from "@/modules/membership-plans/domain/use-cases/get-all-membership-plans.use-case";
import { GetOneMembershipPlanUseCase } from "@/modules/membership-plans/domain/use-cases/get-one-membership-plan.use-case";
import { GetMeUseCase } from "@/modules/auth/domain/use-cases/get-me.use-case";
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
container
  .bind("CouponsRepository")
  .to(CouponsRepositoryImpl)
  .inSingletonScope();
container.bind(CategoriesRepository).toSelf().inSingletonScope();
container.bind(GetAllUsersUseCase).toSelf().inSingletonScope();
container.bind(CreateUserUseCase).toSelf().inSingletonScope();
container.bind(GetAllMerchantsUseCase).toSelf().inSingletonScope();
container.bind(CreateMerchantUseCase).toSelf().inSingletonScope();
container.bind(GetAllBranchesUseCase).toSelf().inSingletonScope();
container.bind(GetOneBranchUseCase).toSelf().inSingletonScope();
container.bind(CreateBranchUseCase).toSelf().inSingletonScope();
container.bind(UpdateBranchUseCase).toSelf().inSingletonScope();
container.bind(DeleteBranchUseCase).toSelf().inSingletonScope();
container.bind(GetAllCategoriesUseCase).toSelf().inSingletonScope();
container.bind(GetOneCategoryUseCase).toSelf().inSingletonScope();
container.bind(CreateCategoryUseCase).toSelf().inSingletonScope();
container.bind(UpdateCategoryUseCase).toSelf().inSingletonScope();
container.bind(DeleteCategoryUseCase).toSelf().inSingletonScope();
container.bind(GetAllCouponsUseCase).toSelf().inSingletonScope();
container.bind(GetOneCouponUseCase).toSelf().inSingletonScope();
container.bind(CreateCouponUseCase).toSelf().inSingletonScope();
container.bind(UpdateCouponUseCase).toSelf().inSingletonScope();
container.bind(DeleteCouponUseCase).toSelf().inSingletonScope();
container.bind(MembershipPlansRepository).toSelf().inSingletonScope();
container.bind(GetAllMembershipPlansUseCase).toSelf().inSingletonScope();
container.bind(GetOneMembershipPlanUseCase).toSelf().inSingletonScope();
container.bind(GetMeUseCase).toSelf().inSingletonScope();
container
  .bind(LocalStorageProtocol)
  .to(LocalStorageProtocolImpl)
  .inSingletonScope();

export default container;
