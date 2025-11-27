import { inject } from "inversify/lib/annotation/inject";
import { injectable } from "inversify/lib/annotation/injectable";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllRedemptionsResponse,
  RedemptionResponse,
  CreateRedemptionRequest,
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
