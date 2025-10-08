import { AxiosHttpClient } from "@/config/protocols/http/axios-http-client";
import { HttpClient, HttpStatusCode } from "@/config/protocols/http/http_utilities";
import { apiUrls } from "@/config/protocols/http";
import { userAdapter } from "@/data/adapters";
import "reflect-metadata";
import { inject, injectable } from 'inversify';
import { UnauthorizedError, UnexpectedError } from "@/data/errors";
import { CustomError } from "@/data/errors/custom-error";
import { ILogin } from "../../../../data/interfaces/login.interface";
import { LoginResponse } from "@/modules/auth/data/interfaces";
import { loginResponseAdapter } from "@/modules/auth/data/adpaters/login.response.adpater";

export abstract class AuthRepository {
    abstract login(loginParams: ILogin): Promise<LoginResponse>;
   

}

@injectable()
export class AuthRepositoryImpl implements AuthRepository {

    private httpClient: AxiosHttpClient;

    constructor(
        @inject(HttpClient) httpClient: AxiosHttpClient
    ) {
        this.httpClient = httpClient;
    }
    /////////////////////////////////LOGIN////////////////////////////////////////////////
    async login(loginParams: ILogin): Promise<LoginResponse> {
        console.log('Params:', loginParams)
        const axiosRequest = await this.httpClient.request({
            url: apiUrls.auth.loginByEmail,
            method: 'post',
            body: loginParams,
            isAuth: false,
        });

        // console.log('axiosRequest', axiosRequest)

        if (axiosRequest.statusCode === HttpStatusCode.ok || axiosRequest.statusCode === HttpStatusCode.created) {
            return loginResponseAdapter(axiosRequest.body);
        }
        else {
            throw new CustomError(axiosRequest.body.message);
        }
    }
 
}