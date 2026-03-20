import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import type {
  AllRedemptionsResponse,
  RedemptionResponse,
  CreateRedemptionRequest,
  GeneratedRedemptionsResponse,
  UsedRedemptionsResponse,
  RedemptionMetricsResponse
} from "../interfaces/redemptions.response.interface";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export abstract class RedemptionsRepository {
  abstract create(
    redemptionData: CreateRedemptionRequest,
    token?: string
  ): Promise<RedemptionResponse>;

  // -----------------------------------------------------
  /**
   * Devuelve el listado de ahorros generados
   * @param token 
   * @param paginationParams 
   * @param filters 
   */
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<AllRedemptionsResponse>;
  // -----------------------------------------------------
  /**
   * Devuelve el listado de Redenciones generadas
   * @param token 
   * @param paginationParams 
   * @param filters 
   */
  abstract getGenerated(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<GeneratedRedemptionsResponse>;
  // -----------------------------------------------------
  /**
   * Devuelve el listado de Validaciones realizadas
   * @param token 
   * @param paginationParams 
   * @param filters 
   */
  abstract getUsed(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { branchId?: number | null; userId?: number | null }
  ): Promise<UsedRedemptionsResponse>;
  // -----------------------------------------------------
  abstract getByMe(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllRedemptionsResponse>;

  abstract getMetrics(token?: string): Promise<RedemptionMetricsResponse>;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
@injectable()
export class RedemptionsRepositoryImpl implements RedemptionsRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  // -----------------------------------------------------
  /**
   * Implementación del método abstracto getAll.
   * 
   * Este endpoint devuelve el listado de los ahorros generados.
   * @param token
   * @param paginationParams 
   * @param filters 
   * @returns 
   */
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

  // -----------------------------------------------------
  /**
   * Implementación del método abstracto getGenerated.
   * 
   * Este endpoint devuelve el listado de las redenciones generadas.
   * @param token
   * @param paginationParams 
   * @param filters 
   * @returns 
   */
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

  // -----------------------------------------------------
  /**
   * Implementación del método abstracto getUsed.
   * 
   * Este endpoint devuelve el listado de las validaciones realizadas.
   * @param token
   * @param paginationParams 
   * @param filters 
   * @returns 
   */
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

  async getMetrics(token?: string): Promise<RedemptionMetricsResponse> {
    const axiosRequest = await this.httpClient.request({
      url: apiUrls.redemptions.metrics,
      method: "get",
      isAuth: true,
      token,
    });

    console.log("Get Redemption Metrics Response:", axiosRequest.body);

    if (axiosRequest.statusCode === HttpStatusCode.ok) {
      return axiosRequest.body as RedemptionMetricsResponse;
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener métricas de redenciones"
      );
    }
  }
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~