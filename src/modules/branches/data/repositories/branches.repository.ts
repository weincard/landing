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
    imageFiles?: File[],
    token?: string
  ): Promise<BranchResponse>;
  abstract getAll(
    merchantId?: number,
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllBranchesResponse>;
  abstract getOne(branchId: number, token?: string): Promise<BranchResponse>;
  abstract update(
    branchId: number,
    branchData: Partial<IBranch>,
    logoFile?: File,
    imageFiles?: File[],
    token?: string
  ): Promise<BranchResponse>;
  abstract delete(
    branchId: number,
    token?: string
  ): Promise<{ message: string }>;
}

@injectable()
export class BranchesRepositoryImpl implements BranchesRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    merchantId?: number,
    token?: string,
    paginationParams?: IPaginationParams,
    filters?: { name?: string }
  ): Promise<AllBranchesResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    // Use the new search endpoint with POST method and pagination as query params
    const url = `${apiUrls.branches.search}?limit=${limit}&skip=${skip}`;

    const requestBody: {
      merchantId?: number;
      search?: string;
    } = {};

    // Only add merchantId if it's defined (not undefined)
    if (merchantId !== undefined) {
      requestBody.merchantId = merchantId;
    }

    // Add search term if provided
    if (filters?.name) {
      requestBody.search = filters.name;
    }

    const axiosRequest = await this.httpClient.request({
      url,
      method: "post",
      body: requestBody,
      isAuth: true,
      token,
    });

    console.log("Search Branches Response:", axiosRequest.body);

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
    imageFiles?: File[],
    token?: string
  ): Promise<BranchResponse> {
    console.log("Create Branch Data:", branchData);
    console.log("Logo file:", logoFile);
    console.log("Image files:", imageFiles);

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

    // Handle image files (File objects)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    if (logoFile) formData.append("logoFile", logoFile);

    // Debug: Log FormData contents
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

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
    imageFiles?: File[],
    token?: string
  ): Promise<BranchResponse> {
    console.log("Update Branch Data:", branchData);

    const formData = new FormData();

    // Only include fields that are allowed for update according to the API spec
    if (branchData.name) formData.append("name", branchData.name);
    if (branchData.description)
      formData.append("description", branchData.description);
    if (branchData.howItWorks)
      formData.append("howItWorks", branchData.howItWorks);
    if (branchData.address) formData.append("address", branchData.address);
    if (branchData.city) formData.append("city", branchData.city);
    if (branchData.country) formData.append("country", branchData.country);
    if (branchData.latitude)
      formData.append("latitude", String(branchData.latitude));
    if (branchData.longitude)
      formData.append("longitude", String(branchData.longitude));
    if (branchData.phone) formData.append("phone", branchData.phone);
    if (branchData.email) formData.append("email", branchData.email);
    if (branchData.website) formData.append("website", branchData.website);
    if (branchData.isActive !== undefined)
      formData.append("isActive", String(branchData.isActive));
    if (branchData.note) formData.append("note", branchData.note);

    // Handle tags array
    if (branchData.tags && branchData.tags.length > 0) {
      branchData.tags.forEach((tag) => {
        formData.append("tags[]", tag);
      });
    }

    // Handle image files (File objects)
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    if (logoFile) formData.append("logoFile", logoFile);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.branches.update}/${branchId}`,
      method: "patch",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": undefined, // Let browser set multipart boundary
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

  async delete(branchId: number, token?: string): Promise<{ message: string }> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.branches.delete}/${branchId}`,
      method: "delete",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Delete Branch Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return {
        message: axiosRequest.body.message || "Sucursal eliminada exitosamente",
      };
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al eliminar sucursal"
      );
    }
  }
}
