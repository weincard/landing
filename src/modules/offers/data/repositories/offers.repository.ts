import type {
  IOffer,
  CreateOfferRequest,
  UpdateOfferRequest,
} from "../interfaces/offers.response.interface";
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import { inject, injectable } from "inversify";
import {
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http/api_urls";
import { CustomError } from "@/data/errors/custom-error";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllOffersResponse,
  OfferResponse,
} from "../interfaces/offers.response.interface";
import {
  allOffersResponseAdapter,
  createOfferResponseAdapter,
  getOfferResponseAdapter,
  updateOfferResponseAdapter,
} from "../adapters/offers.response.adapter";

export abstract class OffersRepository {
  abstract create(
    offerData: CreateOfferRequest,
    token?: string
  ): Promise<OfferResponse>;
  abstract getAll(
    branchId?: string,
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllOffersResponse>;
  abstract getOne(offerId: number, token?: string): Promise<OfferResponse>;
  abstract update(
    offerId: number,
    offerData: UpdateOfferRequest,
    token?: string
  ): Promise<OfferResponse>;
  abstract delete(
    offerId: number,
    token?: string
  ): Promise<{ message: string }>;
}

@injectable()
export class OffersRepositoryImpl implements OffersRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    branchId?: string,
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllOffersResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const url = `${apiUrls.offers.getAll}?limit=${limit}&skip=${skip}`;

    const requestBody: {
      branchId?: string;
    } = {};

    if (branchId) {
      requestBody.branchId = branchId;
    }

    const axiosRequest = await this.httpClient.request({
      url,
      method: "post",
      body: requestBody,
      isAuth: true,
      token,
    });

    console.log("Get All Offers Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allOffersResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener ofertas"
      );
    }
  }

  async getOne(offerId: number, token?: string): Promise<OfferResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.offers.getOne}/${offerId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Offer Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getOfferResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener oferta"
      );
    }
  }

  async create(
    offerData: CreateOfferRequest,
    token?: string
  ): Promise<OfferResponse> {
    console.log("Create Offer Data:", offerData);

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.offers.create,
      method: "post",
      body: offerData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Create Offer Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createOfferResponseAdapter(axiosRequest.body);
    } else {
      console.log(axiosRequest.body);
      throw new CustomError(
        axiosRequest.body.message || "Error al crear oferta"
      );
    }
  }

  async update(
    offerId: number,
    offerData: UpdateOfferRequest,
    token?: string
  ): Promise<OfferResponse> {
    console.log("Update Offer Data:", offerData);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.offers.update}/${offerId}`,
      method: "patch",
      body: offerData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Update Offer Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateOfferResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar oferta"
      );
    }
  }

  async delete(offerId: number, token?: string): Promise<{ message: string }> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.offers.delete}/${offerId}`,
      method: "delete",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Delete Offer Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return {
        message: axiosRequest.body.message || "Oferta eliminada exitosamente",
      };
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al eliminar oferta"
      );
    }
  }
}
