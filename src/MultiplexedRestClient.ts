import axios from 'axios';
import { Authenticator } from './security/Authenticator';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ServiceUnreachableError } from './errors/ServiceUnreachableError';
import { EndpointServerError } from './errors/EndpointServerError';
import { AuthorizationError } from './errors/AuthorizationError';
import { WellKnowMimeContentTypes } from './WellKnowMimeContentTypes';
import { LoggerFactory } from './environments/environment';
import { RequestThrottledError } from './errors/RequestThrottledError';

const loggerFactory = new LoggerFactory();
const logger = loggerFactory.build('verifalia');

export class MultiplexedRestClient {
    private _authenticator: Authenticator;
    private _baseUris: string[];
    private _userAgent: string | undefined;

    constructor(authenticator: Authenticator, baseUris: string[], userAgent: string | undefined = undefined) {
        if (!authenticator) throw new Error('authenticator is null');
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
                    // Default accepted MIME content type
                    'Accept': WellKnowMimeContentTypes.applicationJson
                }
            } as AxiosRequestConfig;

            // Adds the user-agent header only if it has been specified (can't be forced in the browser)

            if (this._userAgent) {
                axiosConfig.headers['User-Agent'] = this._userAgent;
            }

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

            logger.log('Axios config', axiosConfigWithAuthentication);

            let response: AxiosResponse<T>;

            try {
                response = await axios.request<T>(axiosConfigWithAuthentication);
            }
            catch (error) {
                errors.push(error);
                continue;
            }

            // Internal server error HTTP 5xx

            if (response.status >= 500 && response.status <= 599) {
                errors.push(new EndpointServerError(`Endpoint ${baseUri} returned an HTTP ${response.status} status code.`));
                continue;
            }

            // Authentication / authorization error

            if (response.status === 401 || response.status === 403) {
                throw new AuthorizationError(response.statusText);
            }

            // Throttling

            if (response.status === 429) {
                throw new RequestThrottledError();
            }

            return response;
        }

        throw new ServiceUnreachableError(errors);
    }
}