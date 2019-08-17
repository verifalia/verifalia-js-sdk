import { AxiosRequestConfig } from "axios";

export interface Authenticator {
    addAuthentication(axiosConfig: AxiosRequestConfig): AxiosRequestConfig;
}