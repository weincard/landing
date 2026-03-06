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
import {
  OffersRepository,
  OffersRepositoryImpl,
} from "@/modules/offers/data/repositories/offers.repository";
import {
  RedemptionsRepository,
  RedemptionsRepositoryImpl,
} from "@/modules/redemptions/data/repositories/redemptions.repository";
import { CategoriesRepository } from "@/modules/categories/data/repositories/categories.repository";
import {
  GiftsRepository,
  GiftsRepositoryImpl,
} from "@/modules/gifts/data/repositories/gifts.repository";
import { GetAllUsersUseCase } from "@/modules/users/domain/use-cases/get-all-users.use-case";
import { CreateUserUseCase } from "@/modules/users/domain/use-cases/create-user.use-case";
import { GetUserByIdUseCase } from "@/modules/users/domain/use-cases/get-user-by-id.use-case";
import { UpdateUserUseCase } from "@/modules/users/domain/use-cases/update-user.use-case";
import { GetUsersByRoleUseCase } from "@/modules/users/domain/use-cases/get-users-by-role.use-case";
import { DeactivateAccountUseCase } from "@/modules/users/domain/use-cases/deactivate-account.use-case";
import { DeleteUserUseCase } from "@/modules/users/domain/use-cases/delete-user.use-case";
import { GetAllMerchantsUseCase } from "@/modules/merchants/domain/use-cases/get-all-merchants.use-case";
import { CreateMerchantUseCase } from "@/modules/merchants/domain/use-cases/create-merchant.use-case";
import { GetMerchantByIdUseCase } from "@/modules/merchants/domain/use-cases/get-merchant-by-id.use-case";
import { UpdateMerchantUseCase } from "@/modules/merchants/domain/use-cases/update-merchant.use-case";
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
import { GetAllOffersUseCase } from "@/modules/offers/domain/use-cases/get-all-offers.use-case";
import { GetOneOfferUseCase } from "@/modules/offers/domain/use-cases/get-one-offer.use-case";
import { CreateOfferUseCase } from "@/modules/offers/domain/use-cases/create-offer.use-case";
import { UpdateOfferUseCase } from "@/modules/offers/domain/use-cases/update-offer.use-case";
import { DeleteOfferUseCase } from "@/modules/offers/domain/use-cases/delete-offer.use-case";
import { GetAllRedemptionsUseCase } from "@/modules/redemptions/domain/use-cases/get-all-redemptions.use-case";
import { GetMyRedemptionsUseCase } from "@/modules/redemptions/domain/use-cases/get-my-redemptions.use-case";
import { CreateRedemptionUseCase } from "@/modules/redemptions/domain/use-cases/create-redemption.use-case";
import { GetGeneratedRedemptionsUseCase } from "@/modules/redemptions/domain/use-cases/get-generated-redemptions.use-case";
import { GetUsedRedemptionsUseCase } from "@/modules/redemptions/domain/use-cases/get-used-redemptions.use-case";
import { GetAllGiftsUseCase } from "@/modules/gifts/domain/use-cases/get-all-gifts.use-case";
import { GetOneGiftUseCase } from "@/modules/gifts/domain/use-cases/get-one-gift.use-case";
import { CreateGiftUseCase } from "@/modules/gifts/domain/use-cases/create-gift.use-case";
import { UpdateGiftUseCase } from "@/modules/gifts/domain/use-cases/update-gift.use-case";
import { DeleteGiftUseCase } from "@/modules/gifts/domain/use-cases/delete-gift.use-case";
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
container.bind("OffersRepository").to(OffersRepositoryImpl).inSingletonScope();
container
  .bind("RedemptionsRepository")
  .to(RedemptionsRepositoryImpl)
  .inSingletonScope();
container
  .bind("GiftsRepository")
  .to(GiftsRepositoryImpl)
  .inSingletonScope();
container.bind(CategoriesRepository).toSelf().inSingletonScope();
container.bind(GetAllUsersUseCase).toSelf().inSingletonScope();
container.bind(CreateUserUseCase).toSelf().inSingletonScope();
container.bind(GetUserByIdUseCase).toSelf().inSingletonScope();
container.bind(UpdateUserUseCase).toSelf().inSingletonScope();
container.bind(GetUsersByRoleUseCase).toSelf().inSingletonScope();
container.bind(DeactivateAccountUseCase).toSelf().inSingletonScope();
container.bind(DeleteUserUseCase).toSelf().inSingletonScope();
container.bind(GetAllMerchantsUseCase).toSelf().inSingletonScope();
container.bind(CreateMerchantUseCase).toSelf().inSingletonScope();
container.bind(GetMerchantByIdUseCase).toSelf().inSingletonScope();
container.bind(UpdateMerchantUseCase).toSelf().inSingletonScope();
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
container.bind(GetAllOffersUseCase).toSelf().inSingletonScope();
container.bind(GetOneOfferUseCase).toSelf().inSingletonScope();
container.bind(CreateOfferUseCase).toSelf().inSingletonScope();
container.bind(UpdateOfferUseCase).toSelf().inSingletonScope();
container.bind(DeleteOfferUseCase).toSelf().inSingletonScope();
container.bind(GetAllRedemptionsUseCase).toSelf().inSingletonScope();
container.bind(GetMyRedemptionsUseCase).toSelf().inSingletonScope();
container.bind(CreateRedemptionUseCase).toSelf().inSingletonScope();
container.bind(GetGeneratedRedemptionsUseCase).toSelf().inSingletonScope();
container.bind(GetUsedRedemptionsUseCase).toSelf().inSingletonScope();
container.bind(GetAllGiftsUseCase).toSelf().inSingletonScope();
container.bind(GetOneGiftUseCase).toSelf().inSingletonScope();
container.bind(CreateGiftUseCase).toSelf().inSingletonScope();
container.bind(UpdateGiftUseCase).toSelf().inSingletonScope();
container.bind(DeleteGiftUseCase).toSelf().inSingletonScope();
container.bind(MembershipPlansRepository).toSelf().inSingletonScope();
container.bind(GetAllMembershipPlansUseCase).toSelf().inSingletonScope();
container.bind(GetOneMembershipPlanUseCase).toSelf().inSingletonScope();
container.bind(GetMeUseCase).toSelf().inSingletonScope();
container
  .bind(LocalStorageProtocol)
  .to(LocalStorageProtocolImpl)
  .inSingletonScope();

export default container;
