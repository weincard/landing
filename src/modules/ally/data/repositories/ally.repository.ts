import {
  apiUrls,
  AxiosHttpClient,
  HttpClient,
  HttpStatusCode,
} from "@/config/protocols/http";
import "reflect-metadata";
import { inject, injectable } from "inversify";
import { CustomError } from "@/data/errors/custom-error";
import type { UploadFileParams } from "@/config/protocols/http/http_utilities";
import type { IAlly } from "@/data/interfaces/ally.interface";
import type { IPaginationParams } from "@/data/interfaces/pagination-params.interface";
import {
  AllAlliesResponse,
  AllyResponse,
} from "../interfaces/ally.response.interface";
import {
  allAlliesResponseAdapter,
  allyResponseAdapter,
} from "../adapters/ally.response.adapter";

export abstract class AllyRepository {
  abstract create(allyParams: IAlly, imageFile?: File): Promise<AllyResponse>;
  abstract update(allyParams: IAlly, imageFile?: File): Promise<AllyResponse>;
  abstract delete(id: string): Promise<string>;
  abstract getAll(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllAlliesResponse>;
}

@injectable()
export class AllyRepositoryImpl implements AllyRepository {
  private httpClient: AxiosHttpClient;

  constructor(@inject(HttpClient) httpClient: AxiosHttpClient) {
    this.httpClient = httpClient;
  }

  /////////////////////////////////CREATE////////////////////////////////////////////////
  async create(allyParams: IAlly, imageFile?: File): Promise<AllyResponse> {
    // console.log("Params:", allyParams);

    try {
      if (imageFile) {
        // Use uploadFile method for multipart/form-data when an image is provided
        const formData = new FormData();

        // Add ally data as JSON string in a field
        formData.append("id", allyParams.idAlly!.toString());
        formData.append("name", allyParams.name);
        formData.append("description", allyParams.description);
        formData.append("address", allyParams.address);
        formData.append("isActive", allyParams.isActive!.toString());
        formData.append("office", allyParams.office!);
        formData.append("redemptions", allyParams.redemptions!.toString());

        // Add image file
        formData.append("file", imageFile);

        const uploadParams: UploadFileParams = {
          url: apiUrls.allies.create,
          method: "post",
          formData: formData,
        };
        const axiosRequest = await this.httpClient.uploadFile(uploadParams);

        console.log("axiosRequest", axiosRequest);

        if (
          axiosRequest.statusCode === HttpStatusCode.ok ||
          axiosRequest.statusCode === HttpStatusCode.created
        ) {
          // Return the adapted response
          return allyResponseAdapter({
            ...axiosRequest.body,
            message: axiosRequest.body?.message || "Aliado creado exitosamente",
          });
        } else {
          throw new CustomError(
            axiosRequest.body?.message || "Error creating ally"
          );
        }
      } else {
        // Use regular request method when no image is provided
        const axiosRequest = await this.httpClient.request({
          url: apiUrls.allies.create,
          method: "post",
          body: JSON.stringify(allyParams),
          isAuth: true,
        });

        // console.log("axiosRequest", axiosRequest);

        if (
          axiosRequest.statusCode === HttpStatusCode.ok ||
          axiosRequest.statusCode === HttpStatusCode.created
        ) {
          // Return the adapted response
          return allyResponseAdapter({
            ...axiosRequest.body,
            message: axiosRequest.body?.message || "Aliado creado exitosamente",
          });
        } else {
          throw new CustomError(
            axiosRequest.body?.message || "Error getting allies"
          );
        }
      }
    } catch (error) {
      console.error("Error in create method:", error);
      // Rethrow to be handled by the component
      throw error;
    }
  }

  /////////////////////////////////UPDATE////////////////////////////////////////////////
  async update(allyParams: IAlly, imageFile?: File): Promise<AllyResponse> {
    // console.log("Params:", allyParams,imageFile);

    try {
      if (imageFile) {
        // Use uploadFile method for multipart/form-data when an image is provided
        const formData = new FormData();

        // Add species data as JSON string in a field
        formData.append("name", allyParams.name!);
        formData.append("description", allyParams.description!);
        formData.append("address", allyParams.address!);
        formData.append("redemptions", allyParams.redemptions!.toString());

        // Add image file
        formData.append("file", imageFile);

        const uploadParams: UploadFileParams = {
          url: `${apiUrls.allies.update}/${allyParams.idAlly}`,
          method: "patch",
          formData: formData,
        };

        const axiosRequest = await this.httpClient.uploadFile(uploadParams);

        // console.log("axiosRequest", axiosRequest);

        if (
          axiosRequest.statusCode === HttpStatusCode.ok ||
          axiosRequest.statusCode === HttpStatusCode.created
        ) {
          // Return the adapted response
          return allyResponseAdapter({
            ...axiosRequest.body,
            message:
              axiosRequest.body?.message || "Aliado actualizado exitosamente",
          });
        } else {
          throw new CustomError(
            axiosRequest.body?.message || "Error al actualizar el aliado"
          );
        }
      } else {
        const formData = new FormData();

        formData.append("id", allyParams.idAlly!.toString());
        formData.append("name", allyParams.name!);
        formData.append("description", allyParams.description!);
        formData.append("address", allyParams.address!);
        formData.append("isActive", allyParams.isActive!.toString());
        formData.append("office", allyParams.office!);

        // Use regular request method when no image is provided
        const axiosRequest = await this.httpClient.request({
          url: `${apiUrls.allies.update}/${allyParams.idAlly}`,
          method: "patch",
          body: formData,
          isAuth: true,
        });

        // console.log("axiosRequest", axiosRequest);

        if (
          axiosRequest.statusCode === HttpStatusCode.ok ||
          axiosRequest.statusCode === HttpStatusCode.created
        ) {
          // Return the adapted response
          return allyResponseAdapter({
            ...axiosRequest.body,
            message:
              axiosRequest.body?.message || "Aliado actualizado exitosamente",
          });
        } else {
          throw new CustomError(
            axiosRequest.body?.message || "Error al actualizar aliado"
          );
        }
      }
    } catch (error) {
      console.error("Error in update method:", error);
      // Rethrow to be handled by the component
      throw error;
    }
  }

  /////////////////////////////////GET ALL////////////////////////////////////////////////
  async getAll(
    token?: string,
    paginationParams?: IPaginationParams
  ): Promise<AllAlliesResponse> {
    // console.log("Params:", specieId);

    try {
      // Build query parameters if pagination is provided
      let url = apiUrls.allies.getAll;

      if (paginationParams) {
        const queryParams = new URLSearchParams();

        // Use skip and limit directly from paginationParams
        if (paginationParams.skip !== undefined) {
          queryParams.append("skip", paginationParams.skip.toString());
        }

        if (paginationParams.limit !== undefined) {
          queryParams.append("limit", paginationParams.limit.toString());
        }

        // Add search parameter if provided
        if (paginationParams.search) {
          queryParams.append("search", paginationParams.search);
        }

        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
      }

      const axiosRequest = await this.httpClient.request({
        token: token ?? undefined,
        url,
        method: "get",
        isAuth: true,
      });

      // console.log("axiosRequest",JSON.stringify(axiosRequest) )

      if (
        axiosRequest.statusCode === HttpStatusCode.ok ||
        axiosRequest.statusCode === HttpStatusCode.created
      ) {
        // Return the adapted response
        // console.log("EEEEEE:",allBreedsResponseAdapter(axiosRequest.body))
        return allAlliesResponseAdapter(axiosRequest.body);
      } else {
        throw new CustomError(
          axiosRequest.body?.message || "Error al obtener las razas"
        );
      }
    } catch (error) {
      console.error("Error in get method:", error);
      // Rethrow to be handled by the component
      throw error;
    }
  }

  /////////////////////////////////DELETE////////////////////////////////////////////////
  async delete(id: string): Promise<string> {
    try {
      const axiosRequest = await this.httpClient.request({
        url: `${apiUrls.allies.delete}/${id}`,
        method: "delete",
        isAuth: true,
      });

      if (
        axiosRequest.statusCode === HttpStatusCode.ok ||
        axiosRequest.statusCode === HttpStatusCode.created
      ) {
        return axiosRequest.body?.message || "Ally deleted successfully";
      } else {
        throw new CustomError(
          axiosRequest.body?.message || "Error al eliminar aliado"
        );
      }
    } catch (error) {
      console.error("Error in delete method:", error);
      throw error;
    }
  }
}
