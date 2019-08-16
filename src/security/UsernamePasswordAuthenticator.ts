import { IAuthenticator } from "./IAuthenticator";
import { AxiosRequestConfig } from "axios";

export class UsernamePasswordAuthenticator implements IAuthenticator {
    private _username: string;
    private _password: string;

    constructor(username: string, password: string) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user, if you don\'t have one.');
        }

        if (!password && password.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user, if you don\'t have one.');
        }

        this._username = username;
        this._password = password;
    }

    public addAuthentication(axiosConfig: AxiosRequestConfig): AxiosRequestConfig {
        return {
            ...axiosConfig,
            // withCredentials: true,
            auth: {
                username: this._username,
                password: this._password
            }
        };
    }
}
