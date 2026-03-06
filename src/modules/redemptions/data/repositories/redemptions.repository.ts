import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllRedemptionsResponse,
  RedemptionResponse,
  CreateRedemptionRequest,
  GeneratedRedemptionsResponse,
  UsedRedemptionsResponse
} from "../interfaces/redemptions.response.interface";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";

export abstract class RedemptionsRepository {
  abstract create(
    redemptionData: CreateRedemptionRequest,
    token?: string
  ): Promise<RedemptionResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<AllRedemptionsResponse>;
  abstract getGenerated(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<GeneratedRedemptionsResponse>;
  abstract getUsed(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<UsedRedemptionsResponse>;
  abstract getByMe(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllRedemptionsResponse>;
}

@injectable()
export class RedemptionsRepositoryImpl implements RedemptionsRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<AllRedemptionsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.redemptions.getAll}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get All Redemptions Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return axiosRequest.body as AllRedemptionsResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener redenciones"
      );
    }
  }

  async getGenerated(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<GeneratedRedemptionsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.redemptions.getGenerated}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get Generated Redemptions Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return axiosRequest.body as GeneratedRedemptionsResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener códigos de redenciones generados"
      );
    }
  }

  async getUsed(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<UsedRedemptionsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.redemptions.getUsed}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get Used Redemptions Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return axiosRequest.body as UsedRedemptionsResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener códigos de redenciones usados"
      );
    }
  }

  async getByMe(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllRedemptionsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.redemptions.getByMe}?limit=${limit}&skip=${skip}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get My Redemptions Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return axiosRequest.body as AllRedemptionsResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener mis redenciones"
      );
    }
  }

  async create(
    redemptionData: CreateRedemptionRequest,
    token?: string
  ): Promise<RedemptionResponse> {
    console.log("Create Redemption Data:", redemptionData);

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.redemptions.create,
      method: "post",
      body: redemptionData,
      isAuth: true,
      token,
    });

    console.log("Create Redemption Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return axiosRequest.body as RedemptionResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al crear redención"
      );
    }
  }
}
