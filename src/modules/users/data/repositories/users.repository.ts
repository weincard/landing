import type {
  IUser,
  UserRole,
  ICreateUserRequest,
  IUpdateUserRequest,
} from "@/data/interfaces/user.interface";
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
  ApiAllUsersResponse,
  GetUsersByRoleApiResponse,
} from "../interfaces/users.response.interface";
import {
  allUsersResponseAdapter,
  createUserResponseAdapter,
  updateUserResponseAdapter,
  getUserByIdResponseAdapter,
  getUsersByRoleResponseAdapter,
} from "../adpaters/users.response.adpater";

export abstract class UsersRepository {
  abstract create(
    userParams: ICreateUserRequest | IUser,
    token?: string
  ): Promise<UserResponse>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams,
    role?: UserRole
  ): Promise<AllUsersResponse>;
  abstract getByRole(
    roleName: UserRole,
    token?: string
  ): Promise<AllUsersResponse>;
  abstract getOne(userId: number, token?: string): Promise<UserResponse>;
  abstract update(
    userParams: IUpdateUserRequest | IUser,
    token?: string
  ): Promise<UserResponse>;
  abstract deactivateAccount(token?: string): Promise<UserResponse>;
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

    const requestBody: any = {};
    if (role) {
      requestBody.roleName = role;
    }

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.getAll}?limit=${limit}&skip=${skip}`,
      method: "post",
      body: requestBody,
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

  async getByRole(
    roleName: UserRole,
    token?: string
  ): Promise<AllUsersResponse> {
    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.getByRole}/${roleName}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get Users By Role Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getUsersByRoleResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener usuarios por rol"
      );
    }
  }

  /////////////////////////////////CREATE USER////////////////////////////////////////////////
  async create(
    userParams: ICreateUserRequest | IUser,
    token?: string
  ): Promise<UserResponse> {
    console.log("Create User Params:", userParams);

    // Crear FormData para soportar archivos
    const formData = new FormData();

    // Agregar campos requeridos y opcionales
    if (userParams.name) formData.append("name", userParams.name);
    if (userParams.email) formData.append("email", userParams.email);
    if (userParams.password) formData.append("password", userParams.password);
    if (userParams.phone) formData.append("phone", userParams.phone);
    if (userParams.address) formData.append("address", userParams.address);

    // roleName es requerido según la API
    let roleName = "client"; // Valor por defecto

    if ("roleName" in userParams && userParams.roleName) {
      roleName = userParams.roleName;
    } else if ("role" in userParams && userParams.role) {
      if (typeof userParams.role === "string") {
        roleName = userParams.role;
      } else if (typeof userParams.role === "object" && userParams.role?.name) {
        roleName = userParams.role.name;
      }
    }

    formData.append("roleName", roleName);

    if (userParams.documentType)
      formData.append("documentType", userParams.documentType);
    if (userParams.document) formData.append("document", userParams.document);
    if (userParams.country) formData.append("country", userParams.country);
    if (userParams.department)
      formData.append("department", userParams.department);
    if (userParams.city) formData.append("city", userParams.city);

    // isVerified es opcional, por defecto false según la API
    if (userParams.isVerified !== undefined) {
      formData.append("isVerified", userParams.isVerified.toString());
    }

    // Agregar archivo si existe
    if ((userParams as ICreateUserRequest).file) {
      formData.append("file", (userParams as ICreateUserRequest).file!);
    }

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.users.register,
      method: "post",
      body: formData,
      isAuth: true,
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

  /////////////////////////////////GET ONE USER////////////////////////////////////////////////
  async getOne(userId: number, token?: string): Promise<UserResponse> {
    console.log("Get User ID:", userId);

    const axiosRequest = await this.httpClient.request({
      url: `${apiUrls.users.getOne}/${userId}`,
      method: "get",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Get User Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return getUserByIdResponseAdapter(axiosRequest.body);
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al obtener usuario"
      );
    }
  }

  /////////////////////////////////UPDATE USER////////////////////////////////////////////////
  async update(
    userParams: IUpdateUserRequest | IUser,
    token?: string
  ): Promise<UserResponse> {
    console.log("Update User Params:", userParams);

    // Verificar si hay archivo para determinar el tipo de request
    const hasFile = "file" in userParams && userParams.file instanceof File;

    if (hasFile) {
      // Para actualizar con archivo, usamos FormData
      const formData = new FormData();

      if (userParams.name) formData.append("name", userParams.name);
      if (userParams.email) formData.append("email", userParams.email);
      if (userParams.phone) formData.append("phone", userParams.phone);
      if (userParams.document) formData.append("document", userParams.document);
      if (userParams.documentType)
        formData.append("documentType", userParams.documentType);
      if (userParams.country) formData.append("country", userParams.country);
      if (userParams.department)
        formData.append("department", userParams.department);
      if (userParams.city) formData.append("city", userParams.city);
      if (userParams.address) formData.append("address", userParams.address);
      if (userParams.isVerified !== undefined)
        formData.append("isVerified", userParams.isVerified.toString());

      // Manejar roleName
      if ("roleName" in userParams && userParams.roleName) {
        formData.append("roleName", userParams.roleName);
      } else if ("role" in userParams && userParams.role) {
        if (typeof userParams.role === "string") {
          formData.append("roleName", userParams.role);
        } else if (
          typeof userParams.role === "object" &&
          userParams.role &&
          "name" in userParams.role
        ) {
          formData.append("roleName", (userParams.role as any).name);
        }
      }

      // Manejar archivo
      if ("file" in userParams) {
        if (userParams.file === null) {
          // Enviar campo vacío o null para indicar eliminación
          formData.append("file", "");
        } else if (userParams.file) {
          // Agregar archivo si existe
          formData.append("file", userParams.file);
        }
      }

      const userId =
        (userParams as IUser).idUsuario || (userParams as IUser).userId;

      const axiosRequest = await this.httpClient.request({
        url: `${apiUrls.users.update}/${userId}`,
        method: "patch",
        body: formData,
        isAuth: true,
        token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Update User with File Response:", axiosRequest.body);

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
    } else {
      // Para actualizar sin archivo, usamos application/json
      const requestBody: any = {};

      if (userParams.name) requestBody.name = userParams.name;
      if (userParams.email) requestBody.email = userParams.email;
      if (userParams.phone) requestBody.phone = userParams.phone;
      if (userParams.document) requestBody.document = userParams.document;
      if (userParams.documentType)
        requestBody.documentType = userParams.documentType;
      if (userParams.country) requestBody.country = userParams.country;
      if (userParams.department) requestBody.department = userParams.department;
      if (userParams.city) requestBody.city = userParams.city;
      if (userParams.address) requestBody.address = userParams.address;
      if (userParams.isVerified !== undefined)
        requestBody.isVerified = userParams.isVerified;

      // Manejar roleName
      if ("roleName" in userParams && userParams.roleName) {
        requestBody.roleName = userParams.roleName;
      } else if ("role" in userParams && userParams.role) {
        if (typeof userParams.role === "string") {
          requestBody.roleName = userParams.role;
        } else if (
          typeof userParams.role === "object" &&
          userParams.role?.name
        ) {
          requestBody.roleName = userParams.role.name;
        }
      }

      const userId =
        (userParams as IUser).idUsuario || (userParams as IUser).userId;

      const axiosRequest = await this.httpClient.request({
        url: `${apiUrls.users.update}/${userId}`,
        method: "patch",
        body: requestBody,
        isAuth: true,
        token,
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
  }

  /////////////////////////////////DEACTIVATE ACCOUNT////////////////////////////////////////////////
  async deactivateAccount(token?: string): Promise<UserResponse> {
    console.log("Deactivate Account");

    const axiosRequest = await this.httpClient.request({
      url: apiUrls.users.deactivateAccount,
      method: "patch",
      body: {},
      isAuth: true,
      token,
    });

    console.log("Deactivate Account Response:", axiosRequest.body);

    if (
      axiosRequest.statusCode === HttpStatusCode.ok ||
      axiosRequest.statusCode === HttpStatusCode.created
    ) {
      return {
        message: axiosRequest.body.message || "Cuenta desactivada exitosamente",
      };
    } else {
      throw new CustomError(
        axiosRequest.body.message || "Error al desactivar cuenta"
      );
    }
  }
}
