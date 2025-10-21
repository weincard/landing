import type { ICoupon } from "@/data/interfaces/coupon.interface";
import { inject } from "inversify/lib/annotation/inject";
import { injectable } from "inversify/lib/annotation/injectable";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllCouponsResponse,
  CouponResponse,
} from "../interfaces/coupons.response.interface";
import {
  allCouponsResponseAdapter,
  createCouponResponseAdapter,
  getCouponResponseAdapter,
  updateCouponResponseAdapter,
} from "../adapters/coupons.response.adapter";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";

export abstract class CouponsRepository {
  abstract create(
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllCouponsResponse>;
  abstract getOne(couponId: number, token?: string): Promise<CouponResponse>;
  abstract update(
    couponId: number,
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse>;
  abstract delete(
    couponId: number,
    token?: string
  ): Promise<{ message: string }>;
}

@injectable()
export class CouponsRepositoryImpl implements CouponsRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllCouponsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.coupons.getAll}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get All Coupons Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allCouponsResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener cupones"
      );
    }
  }

  async getOne(couponId: number, token?: string): Promise<CouponResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.coupons.getOne}/${couponId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Coupon Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getCouponResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener cupón"
      );
    }
  }

  async create(
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse> {
    const axiosRequest = await this.httpClient.request({
      url: apiUrls.coupons.create,
      method: "post",
      body: couponData,
      isAuth: true,
      token,
    });

    console.log("Create Coupon Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createCouponResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al crear cupón"
      );
    }
  }

  async update(
    couponId: number,
    couponData: Partial<ICoupon>,
    token?: string
  ): Promise<CouponResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.coupons.update}/${couponId}`,
      method: "put",
      body: couponData,
      isAuth: true,
      token,
    });

    console.log("Update Coupon Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateCouponResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar cupón"
      );
    }
  }

  async delete(couponId: number, token?: string): Promise<{ message: string }> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.coupons.delete}/${couponId}`,
      method: "delete",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Delete Coupon Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return {
        message: axiosRequest.body.message || "Cupón eliminado exitosamente",
      };
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al eliminar cupón"
      );
    }
  }
}
