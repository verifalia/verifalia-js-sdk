import { AxiosRequestConfig } from "axios";

export interface IAuthenticator {
    addAuthentication(axiosConfig: AxiosRequestConfig): AxiosRequestConfig;
}