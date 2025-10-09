import type { IUser, UserRole } from "@/data/interfaces/user.interface";
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
  AllUsersResponse,
  UserResponse,
} from "../interfaces/users.response.interface";
import {
  allUsersResponseAdapter,
  createUserResponseAdapter,
  deleteUserResponseAdapter,
  updateUserResponseAdapter,
} from "../adpaters/users.response.adpater";

export abstract class UsersRepository {
  abstract create(userParams: IUser): Promise<UserResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    role?: UserRole
  ): Promise<AllUsersResponse>;
  abstract delete(id: string): Promise<UserResponse>;
}

@injectable()
export class UsersRepositoryImpl implements UsersRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  async getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    role?: UserRole
  ): Promise<AllUsersResponse> {
    const { limit = 10, skip = 0 } = paginationParams || {};

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.getAll}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: {
        roleName: role,
      },
      isAuth: true,
      token,
    });

    console.log("Get All Users Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return allUsersResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener usuarios"
      );
    }
  }

  /////////////////////////////////CREATE USER////////////////////////////////////////////////
  async create(userParams: IUser): Promise<UserResponse> {
    console.log("Create User Params:", userParams);

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.users.register,
      method: "post",
      body: userParams,
      isAuth: true,
    });

    console.log("Create User Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return createUserResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al crear usuario"
      );
    }
  }

  /////////////////////////////////UPDATE USER////////////////////////////////////////////////
  async update(userParams: IUser): Promise<UserResponse> {
    console.log("Update User Params:", userParams);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.update}/${userParams.id}`,
      method: "patch",
      body: userParams,
      isAuth: true,
    });

    console.log("Update User Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return updateUserResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al actualizar usuario"
      );
    }
  }

  /////////////////////////////////DELETE USER////////////////////////////////////////////////
  async delete(id: string): Promise<UserResponse> {
    console.log("Delete User ID:", id);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.delete}/${id}`,
      method: "delete",
      body: {},
      isAuth: true,
    });

    console.log("Delete User Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return deleteUserResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al eliminar usuario"
      );
    }
  }
}
