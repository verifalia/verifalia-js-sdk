import { Authenticator } from './security/Authenticator';
import { CancellationToken } from '../common/CancellationToken';
import { RestResponse } from './RestResponse';
export declare class MultiplexedRestClient {
    private _authenticator;
    private _baseUris;
    private _userAgent;
    constructor(authenticator: Authenticator, baseUris: string[], userAgent?: string | undefined);
    invoke<T>(method: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'DELETE', resource: string, params?: any, data?: any, configOverride?: any, cancellationToken?: CancellationToken): Promise<RestResponse<T>>;
}
//# sourceMappingURL=MultiplexedRestClient.d.ts.map