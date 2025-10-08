import { CookiesKeysEnum } from '@/utilities/enums';
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { HttpClient, HttpRequest, HttpResponse, UploadFileParams } from './http_utilities'
import { getCookie } from 'cookies-next';
import "reflect-metadata";
import { injectable } from 'inversify';

@injectable()
export class AxiosHttpClient implements HttpClient {
  axiosInstance: AxiosInstance;
  constructor(
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      // baseURL:'https://a0ea-79-141-166-136.ngrok-free.app/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      }
    });
  }

  async request(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    const { baseUrl, url, method, body, headers, token, params, isAuth = true } = data;

    // console.log('token:',token)

    const authHeader = {
      'Authorization': `Bearer ${token ? token : getCookie(CookiesKeysEnum.token)}`
    }

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
      })
    } catch (error: any) {
      axiosResponse = error.response
    }
    // console.log('Data', data, 'axiosRequest:', axiosResponse)

    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data
    }

  }

  async uploadFile(data: HttpRequest, onUploadProgress?: (progressEvent: any) => void): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await this.axiosInstance.request({
        baseURL: data.baseUrl,
        url: data.url,
        method: data.method,
        headers: {
          ...data.headers,
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${data.token ? data.token : getCookie(CookiesKeysEnum.token)}`,
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
      body: axiosResponse.data
    };
  }

  async updateFile(params: UploadFileParams): Promise<HttpResponse> {
    const axiosResponse = await this.axiosInstance.put(`${process.env.NEXT_PUBLIC_API_URL}/${params.url}`,
      params.formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${params.token ? params.token : getCookie(CookiesKeysEnum.token)}`,
        }
      })
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    }
  }

}