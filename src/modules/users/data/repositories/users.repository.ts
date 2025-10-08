import type { IUser } from "@/data/interfaces/user.interface"
import type { AxiosHttpClient } from "@/config/protocols/http/axios-http-client"
import { inject } from "inversify/lib/annotation/inject"
import { HttpClient, HttpStatusCode } from "@/config/protocols/http/http_utilities"
import { injectable } from "inversify/lib/annotation/injectable"
import { apiUrls } from "@/config/protocols/http/api_urls"
import { CustomError } from "@/data/errors/custom-error"

import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface"
import { AllUsersResponse, UserResponse } from "../interfaces/users.response.interface"
import { allUsersResponseAdapter, createUserResponseAdapter, deleteUserResponseAdapter, updateUserResponseAdapter } from "../adpaters/users.response.adpater"

export abstract class UsersRepository {
  abstract create(userParams: IUser): Promise<UserResponse>
  abstract update(userParams: IUser): Promise<UserResponse>
  abstract getAll(token?: string, paginationParams?: IPaginationParams): Promise<AllUsersResponse>
  abstract delete(id: string): Promise<UserResponse>
}

@injectable()
export class UsersRepositoryImpl implements UsersRepository {
  private httpClient: AxiosHttpClient

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  /////////////////////////////////CREATE////////////////////////////////////////////////
  async create(userParams: IUser): Promise<UserResponse> {
    console.log("Params:", userParams)

    try {
      // Preparar datos para la API
      const userData = {
        firstName: userParams.nombre,
        lastName: userParams.apellido,
        email: userParams.email,
        password: userParams.contrasena,
        phone: userParams.telefono,
        role: userParams.role || "Comprador",
      }

      const axiosRequest = await this.httpClient.request({
        url: apiUrls.users.create,
        method: "post",
        body: JSON.stringify(userData),
        isAuth: true,
      })

      console.log("axiosRequest", axiosRequest)

      if (axiosRequest.statusCode === HttpStatusCode.ok || axiosRequest.statusCode === HttpStatusCode.created) {
        // Return the adapted response
        return createUserResponseAdapter({
          ...axiosRequest.body,
          message: axiosRequest.body?.message || "Usuario creado exitosamente",
        })
      } else {
        throw new CustomError(axiosRequest.body?.message || "Error al crear el usuario")
      }
    } catch (error) {
      console.error("Error in create method:", error)
      // Rethrow to be handled by the component
      throw error
    }
  }

  /////////////////////////////////UPDATE////////////////////////////////////////////////
  async update(userParams: IUser): Promise<UserResponse> {
    console.log("Params:", userParams)

    try {
      // Preparar datos para la API
      const userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string | undefined;
        isVerified: boolean | undefined;
        password?: string;
      } = {
        firstName: userParams.nombre,
        lastName: userParams.apellido,
        email: userParams.email,
        phone: userParams.telefono,
        role: userParams.role,
        isVerified: userParams.estaVerificado,
      }

      // Si hay contraseña, la incluimos
      if (userParams.contrasena) {
        userData["password"] = userParams.contrasena
      }

      const axiosRequest = await this.httpClient.request({
        url: `${apiUrls.users.update}/${userParams.idUsuario}`,
        method: "patch",
        body: JSON.stringify(userData),
        isAuth: true,
      })

      console.log("axiosRequest", axiosRequest)

      if (axiosRequest.statusCode === HttpStatusCode.ok || axiosRequest.statusCode === HttpStatusCode.created) {
        // Return the adapted response
        return updateUserResponseAdapter({
          ...axiosRequest.body,
          message: axiosRequest.body?.message || "Usuario actualizado exitosamente",
        })
      } else {
        throw new CustomError(axiosRequest.body?.message || "Error al actualizar el usuario")
      }
    } catch (error) {
      console.error("Error in update method:", error)
      // Rethrow to be handled by the component
      throw error
    }
  }

  /////////////////////////////////GET ALL////////////////////////////////////////////////
  async getAll(token?: string, paginationParams?: IPaginationParams): Promise<AllUsersResponse> {
    try {
      // Build query parameters if pagination is provided
      let url = apiUrls.users.getAll

      if (paginationParams) {
        const queryParams = new URLSearchParams()
        if (paginationParams.skip !== undefined) {
          queryParams.append("skip", paginationParams.skip.toString())
        }
        if (paginationParams.limit !== undefined) {
          queryParams.append("limit", paginationParams.limit.toString())
        }
        if (paginationParams.search) {
          queryParams.append("search", paginationParams.search)
        }

        if (queryParams.toString()) {
          url = `${url}?${queryParams.toString()}`
        }
      }

      const axiosRequest = await this.httpClient.request({
        token: token ?? undefined,
        url,
        method: "get",
        isAuth: true,
      })

      if (axiosRequest.statusCode === HttpStatusCode.ok || axiosRequest.statusCode === HttpStatusCode.created) {
        // Return the adapted response
        return allUsersResponseAdapter(axiosRequest.body)
      } else {
        throw new CustomError(axiosRequest.body?.message || "Error al obtener los usuarios")
      }
    } catch (error) {
      console.error("Error in getAll method:", error)
      // Rethrow to be handled by the component
      throw error
    }
  }

  /////////////////////////////////DELETE////////////////////////////////////////////////
  async delete(id: string): Promise<UserResponse> {
    console.log("Params:", id)

    try {
      const axiosRequest = await this.httpClient.request({
        url: `${apiUrls.users.delete}/${id}`,
        method: "delete",
        isAuth: true,
      })

      console.log("axiosRequest", axiosRequest)

      if (axiosRequest.statusCode === HttpStatusCode.ok || axiosRequest.statusCode === HttpStatusCode.created) {
        // Return the adapted response
        return deleteUserResponseAdapter({
          ...axiosRequest.body,
          message: axiosRequest.body?.message || "Usuario eliminado exitosamente",
        })
      } else {
        throw new CustomError(axiosRequest.body?.message || "Error al eliminar el usuario")
      }
    } catch (error) {
      console.error("Error in delete method:", error)
      // Rethrow to be handled by the component
      throw error
    }
  }
}
