import type { IBranch } from "@/data/interfaces/merchant.interface";
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
  AllBranchesResponse,
  BranchResponse,
} from "../interfaces/branches.response.interface";
import {
  allBranchesResponseAdapter,
  createBranchResponseAdapter,
  getBranchResponseAdapter,
  updateBranchResponseAdapter,
} from "../adapters/branches.response.adapter";

export abstract class BranchesRepository {
  abstract create(
    branchData: Partial<IBranch>,
    logoFile?: File,
    token?: string
  ): Promise<BranchResponse>;
  abstract getAll(
    merchantId: number,
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllBranchesResponse>;
  abstract getOne(branchId: number, token?: string): Promise<BranchResponse>;
  abstract update(
    branchId: number,
    branchData: Partial<IBranch>,
    logoFile?: File,
    token?: string
  ): Promise<BranchResponse>;
}

@injectable()
export class BranchesRepositoryImpl implements BranchesRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    merchantId: number,
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllBranchesResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    // If merchantId is provided, use the by-merchant endpoint
    const url = `${apiUrls.branches.getByMerchant}/${merchantId}?limit=${limit}&skip=${skip}`;

    const axiosRequest = await this.httpClient.request({
      url,
      method: "get",
      body: filters || {},
      isAuth: true,
      token,
    });

    console.log("Get All Branches Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allBranchesResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener sucursales"
      );
    }
  }

  async getOne(branchId: number, token?: string): Promise<BranchResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.branches.getOne}/${branchId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Branch Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getBranchResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener sucursal"
      );
    }
  }

  async create(
    branchData: Partial<IBranch>,
    logoFile?: File,
    token?: string
  ): Promise<BranchResponse> {
    console.log("Create Branch Data:", branchData);

    const formData = new FormData();

    // Required fields
    if (branchData.merchantId)
      formData.append("merchantId", String(branchData.merchantId));
    if (branchData.userId) formData.append("userId", String(branchData.userId));
    if (branchData.name) formData.append("name", branchData.name);
    if (branchData.address) formData.append("address", branchData.address);
    if (branchData.city) formData.append("city", branchData.city);
    if (branchData.country) formData.append("country", branchData.country);
    if (branchData.phone) formData.append("phone", branchData.phone);
    if (branchData.email) formData.append("email", branchData.email);

    // Optional fields
    if (branchData.categoryId)
      formData.append("categoryId", String(branchData.categoryId));
    if (branchData.description)
      formData.append("description", branchData.description);
    if (branchData.howItWorks)
      formData.append("howItWorks", branchData.howItWorks);
    if (branchData.latitude)
      formData.append("latitude", String(branchData.latitude));
    if (branchData.longitude)
      formData.append("longitude", String(branchData.longitude));
    if (branchData.website) formData.append("website", branchData.website);
    if (branchData.note) formData.append("note", branchData.note);
    if (branchData.isActive !== undefined)
      formData.append("isActive", String(branchData.isActive));

    // Handle tags array
    if (branchData.tags && branchData.tags.length > 0) {
      branchData.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }

    // Handle images array (these would be separate files)
    if (branchData.images && branchData.images.length > 0) {
      branchData.images.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    if (logoFile) formData.append("logoFile", logoFile);

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.branches.create,
      method: "post",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Create Branch Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createBranchResponseAdapter(axiosRequest.body);
    } else {
      console.log(axiosRequest.body);
      throw new CustomError(
        axiosRequest.body.message || "Error al crear sucursal"
      );
    }
  }

  async update(
    branchId: number,
    branchData: Partial<IBranch>,
    logoFile?: File,
    token?: string
  ): Promise<BranchResponse> {
    console.log("Update Branch Data:", branchData);

    const formData = new FormData();

    // Optional update fields
    if (branchData.merchantId)
      formData.append("merchantId", String(branchData.merchantId));
    if (branchData.userId) formData.append("userId", String(branchData.userId));
    if (branchData.name) formData.append("name", branchData.name);
    if (branchData.address) formData.append("address", branchData.address);
    if (branchData.city) formData.append("city", branchData.city);
    if (branchData.country) formData.append("country", branchData.country);
    if (branchData.phone) formData.append("phone", branchData.phone);
    if (branchData.email) formData.append("email", branchData.email);
    if (branchData.categoryId)
      formData.append("categoryId", String(branchData.categoryId));
    if (branchData.description)
      formData.append("description", branchData.description);
    if (branchData.howItWorks)
      formData.append("howItWorks", branchData.howItWorks);
    if (branchData.latitude)
      formData.append("latitude", String(branchData.latitude));
    if (branchData.longitude)
      formData.append("longitude", String(branchData.longitude));
    if (branchData.website) formData.append("website", branchData.website);
    if (branchData.note) formData.append("note", branchData.note);
    if (branchData.isActive !== undefined)
      formData.append("isActive", String(branchData.isActive));

    // Handle tags array
    if (branchData.tags && branchData.tags.length > 0) {
      branchData.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }

    // Handle images array
    if (branchData.images && branchData.images.length > 0) {
      branchData.images.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    if (logoFile) formData.append("file", logoFile);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.branches.update}/${branchId}`,
      method: "patch",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Update Branch Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateBranchResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar sucursal"
      );
    }
  }
}
