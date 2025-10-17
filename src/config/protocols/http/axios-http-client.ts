import { CookiesKeysEnum } from "@/utilities/enums";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  UploadFileParams,
} from "./http_utilities";
import { getCookie } from "cookies-next";
import "reflect-metadata";
import { injectable } from "inversify";
import { toast } from "sonner";
import { axiosInterceptorConfig } from "./axios-interceptor.config";

@injectable()
export class AxiosHttpClient implements HttpClient {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      // baseURL:'https://a0ea-79-141-166-136.ngrok-free.app/api',
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Puedes agregar lógica aquí si necesitas hacer algo antes de cada request
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Manejar respuestas exitosas
        const { status, data, config } = response;
        const method = config.method?.toUpperCase();
        const url = config.url || "";

        // Verificar si la ruta está excluida
        if (axiosInterceptorConfig.isExcludedRoute(url)) {
          return response;
        }

        // Solo mostrar toast de éxito si está habilitado y cumple las condiciones
        if (
          axiosInterceptorConfig.enableSuccessToast &&
          axiosInterceptorConfig.successStatusCodes.includes(status) &&
          method &&
          axiosInterceptorConfig.successMethods.includes(method)
        ) {
          const message = data?.message;
          if (message && typeof message === "string") {
            toast.success(message);
          }
        }

        return response;
      },
      (error) => {
        // Manejar errores
        if (!axiosInterceptorConfig.enableErrorToast) {
          return Promise.reject(error);
        }

        const url = error.config?.url || "";

        // Verificar si la ruta está excluida
        if (axiosInterceptorConfig.isExcludedRoute(url)) {
          return Promise.reject(error);
        }

        if (error.response) {
          const { status, data } = error.response;
          const message =
            data?.message || data?.error || "Ha ocurrido un error";

          // Diferentes tipos de errores
          switch (status) {
            case 400:
              toast.error(message || "Solicitud incorrecta");
              break;
            case 401:
              toast.error(message || "No autorizado. Por favor, inicia sesión");
              break;
            case 403:
              toast.error(
                message || "No tienes permisos para realizar esta acción"
              );
              break;
            case 404:
              toast.error(message || "Recurso no encontrado");
              break;
            case 409:
              toast.error(message || "Conflicto con el recurso existente");
              break;
            case 422:
              toast.error(message || "Datos de validación incorrectos");
              break;
            case 500:
              toast.error(message || "Error interno del servidor");
              break;
            default:
              if (status >= 400) {
                toast.error(message);
              }
          }
        } else if (error.request) {
          // La petición fue hecha pero no se recibió respuesta
          toast.error("No se pudo conectar con el servidor");
        } else {
          // Algo pasó al configurar la petición
          toast.error("Error al procesar la solicitud");
        }

        return Promise.reject(error);
      }
    );
  }

  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    const {
      baseUrl,
      url,
      method,
      body,
      headers,
      token,
      params,
      isAuth = true,
    } = data;

    // console.log('token:',token)

    const authHeader = {
      Authorization: `Bearer ${
        token ? token : getCookie(CookiesKeysEnum.token)
      }`,
    };

    try {
      axiosResponse = await this.axiosInstance.request({
        baseURL: baseUrl,
        url: url,
        method: method,
        data: body,
        headers: {
          ...headers,
          ...(isAuth ? authHeader : {}),
        },
        params: params,
      });
    } catch (error: any) {
      axiosResponse = error.response;
    }
    // console.log('Data', data, 'axiosRequest:', axiosResponse)

    if (!axiosResponse) {
      return {
        statusCode: 500,
        body: {
          message: "No response from server",
        },
      };
    }

    return {
      statusCode: axiosResponse.status || 404,
      body: axiosResponse.data,
    };
  }

  async uploadFile(
    data: HttpRequest,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await this.axiosInstance.request({
        baseURL: data.baseUrl,
        url: data.url,
        method: data.method,
        headers: {
          ...data.headers,
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            data.token ? data.token : getCookie(CookiesKeysEnum.token)
          }`,
        },
        params: data.params,
        data: data.formData,
        onUploadProgress,
      });
    } catch (error: any) {
      axiosResponse = error.response;
    }

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }

  async updateFile(params: UploadFileParams): Promise<HttpResponse> {
    const axiosResponse = await this.axiosInstance.put(
      `${process.env.NEXT_PUBLIC_API_URL}/${params.url}`,
      params.formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${
            params.token ? params.token : getCookie(CookiesKeysEnum.token)
          }`,
        },
      }
    );
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
