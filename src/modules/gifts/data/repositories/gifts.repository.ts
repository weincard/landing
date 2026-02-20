import type { IGift } from "@/data/interfaces/gift.interface";
import { inject, injectable } from "inversify";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllGiftsResponse,
  GiftResponse,
} from "../interfaces/gifts.response.interface";
import {
  allGiftsResponseAdapter,
  createGiftResponseAdapter,
  getGiftResponseAdapter,
  updateGiftResponseAdapter,
} from "../adapters/gifts.response.adapter";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";

export abstract class GiftsRepository {
  abstract create(
    giftData: Partial<IGift>,
    token?: string
  ): Promise<GiftResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllGiftsResponse>;
  abstract getOne(giftId: number, token?: string): Promise<GiftResponse>;
  abstract update(
    giftId: number,
    giftData: Partial<IGift>,
    token?: string
  ): Promise<GiftResponse>;
  abstract delete(
    giftId: number,
    token?: string
  ): Promise<{ message: string }>;
}

@injectable()
export class GiftsRepositoryImpl implements GiftsRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string; isActive?: boolean }
  ): Promise<AllGiftsResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.gifts.getAll}?limit=${limit}&skip=${skip}`,
      method: "get",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get All Gifts Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allGiftsResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener regalos"
      );
    }
  }

  async getOne(giftId: number, token?: string): Promise<GiftResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.gifts.getOne}/${giftId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Gift Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getGiftResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener regalo"
      );
    }
  }

  async create(
    giftData: Partial<IGift>,
    token?: string
  ): Promise<GiftResponse> {
    console.log("Repository - Gift data received:", giftData);
    console.log("Repository - Keys:", Object.keys(giftData));

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.gifts.create,
      method: "post",
      body: giftData,
      isAuth: true,
      token,
    });

    console.log("Create Gift Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createGiftResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al crear regalo"
      );
    }
  }

  async update(
    giftId: number,
    giftData: Partial<IGift>,
    token?: string
  ): Promise<GiftResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.gifts.update}/${giftId}`,
      method: "put",
      body: giftData,
      isAuth: true,
      token,
    });

    console.log("Update Gift Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateGiftResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar regalo"
      );
    }
  }

  async delete(giftId: number, token?: string): Promise<{ message: string }> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.gifts.delete}/${giftId}`,
      method: "delete",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Delete Gift Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return {
        message: axiosRequest.body.message || "Regalo eliminado exitosamente",
      };
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al eliminar regalo"
      );
    }
  }
}
