import axios from 'axios';
import { IAuthenticator } from './security/IAuthenticator';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ServiceUnreachableError } from './errors/ServiceUnreachableError';
import { EndpointServerError } from './errors/EndpointServerError';
import { AuthorizationError } from './errors/AuthorizationError';
import { WellKnowMimeContentTypes } from './WellKnowMimeContentTypes';

export class MultiplexedRestClient {
    private _authenticator: IAuthenticator;
    private _userAgent: string;
    private _baseUris: string[];

    constructor(authenticator: IAuthenticator, userAgent: string, baseUris: string[]) {
        if (!authenticator) throw new Error('authenticator is null');
        if (!userAgent) throw new Error('userAgent is null');
        if (!baseUris || !baseUris.length) throw new Error('baseUris is null or empty');

        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
    }

    public async invoke<T>(method: "HEAD" | "GET" | "POST" | "PUT" | "DELETE", resource: string, params?: any, data?: any, configOverride?: any): Promise<AxiosResponse<T>> {
        const errors: any[] = [];

        for (let idxUri = 0; idxUri < this._baseUris.length; idxUri++) {
            const baseUri = this._baseUris[idxUri];

            let axiosConfig = {
                method,
                url: `${baseUri}${resource}`,
                params,
                data,
                validateStatus: () => true,
                maxRedirects: 0,
                headers: {
                    'User-Agent': this._userAgent,
                    // Default accepted MIME content type
                    'Accept': WellKnowMimeContentTypes.applicationJson
                }
            } as AxiosRequestConfig;

            if (method === 'POST' || method === 'PUT') {
                axiosConfig = {
                    ...axiosConfig,
                    headers: {
                        ...axiosConfig.headers,
                        'Content-Type': WellKnowMimeContentTypes.applicationJson
                    }
                };
            }

            axiosConfig = {
                ...axiosConfig,
                ...configOverride
            };

            const axiosConfigWithAuthentication = this._authenticator.addAuthentication(axiosConfig);

            console.log('Axios config', axiosConfigWithAuthentication);

            let response: AxiosResponse<T>;

            try {
                response = await axios.request<T>(axiosConfigWithAuthentication);
            }
            catch (error) {
                errors.push(error);
                continue;
            }

            if (response.status >= 500 && response.status <= 599) {
                errors.push(new EndpointServerError(`Endpoint ${baseUri} returned an HTTP ${response.status} status code.`));
                continue;
            }

            if (response.status === 401 || response.status === 403) {
                throw new AuthorizationError(response.statusText);
            }

            return response;
        }

        throw new ServiceUnreachableError(errors);
    }
}