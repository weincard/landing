import type { IMerchant } from "@/data/interfaces/merchant.interface";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import { inject } from "inversify/lib/annotation/inject";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { injectable } from "inversify/lib/annotation/injectable";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllMerchantsResponse,
  MerchantResponse,
} from "../interfaces/merchants.response.interface";
import {
  allMerchantsResponseAdapter,
  createMerchantResponseAdapter,
  getMerchantResponseAdapter,
  updateMerchantResponseAdapter,
} from "../adapters/merchants.response.adapter";

export abstract class MerchantsRepository {
  abstract create(
    merchantData: Partial<IMerchant>,
    logoFile?: File,
    token?: string
  ): Promise<MerchantResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllMerchantsResponse>;
  abstract getOne(
    merchantId: number,
    token?: string
  ): Promise<MerchantResponse>;
  abstract update(
    merchantId: number,
    merchantData: Partial<IMerchant>,
    logoFile?: File,
    token?: string
  ): Promise<MerchantResponse>;
}

@injectable()
export class MerchantsRepositoryImpl implements MerchantsRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllMerchantsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.merchants.getAll}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get All Merchants Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allMerchantsResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener merchants"
      );
    }
  }

  async getOne(merchantId: number, token?: string): Promise<MerchantResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.merchants.getOne}/${merchantId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Merchant Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getMerchantResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener merchant"
      );
    }
  }

  async create(
    merchantData: Partial<IMerchant>,
    logoFile?: File,
    token?: string
  ): Promise<MerchantResponse> {
    console.log("Create Merchant Data:", merchantData);

    const formData = new FormData();

    if (merchantData.name) formData.append("name", merchantData.name);
    if (merchantData.description)
      formData.append("description", merchantData.description);
    if (merchantData.country) formData.append("country", merchantData.country);
    if (merchantData.state) formData.append("state", merchantData.state);
    if (merchantData.founder !== undefined)
      formData.append("founder", String(merchantData.founder));

    // Agregar userId desde merchantUsers
    if (merchantData.merchantUsers && merchantData.merchantUsers.length > 0) {
      formData.append("userId", String(merchantData.merchantUsers[0].userId));
    }

    if (logoFile) formData.append("file", logoFile);

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.merchants.create,
      method: "post",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Create Merchant Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createMerchantResponseAdapter(axiosRequest.body);
    } else {
      console.log(axiosRequest.body);
      throw new CustomError(
        axiosRequest.body.message || "Error al crear merchant"
      );
    }
  }

  async update(
    merchantId: number,
    merchantData: Partial<IMerchant>,
    logoFile?: File,
    token?: string
  ): Promise<MerchantResponse> {
    console.log("Update Merchant Data:", merchantData);

    const formData = new FormData();

    if (merchantData.name) formData.append("name", merchantData.name);
    if (merchantData.description)
      formData.append("description", merchantData.description);
    if (merchantData.country) formData.append("country", merchantData.country);
    if (merchantData.state) formData.append("state", merchantData.state);
    if (merchantData.founder !== undefined)
      formData.append("founder", String(merchantData.founder));
    if (logoFile) formData.append("file", logoFile);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.merchants.update}/${merchantId}`,
      method: "patch",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Update Merchant Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateMerchantResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar merchant"
      );
    }
  }
}
