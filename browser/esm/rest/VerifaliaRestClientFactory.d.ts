import { Authenticator } from "./security/Authenticator";
import { RestClientFactory } from "./RestClientFactory";
import { MultiplexedRestClient } from "./MultiplexedRestClient";
/**
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
export declare class VerifaliaRestClientFactory implements RestClientFactory {
    /**
     * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
     * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
     */
    apiVersion: string;
    private _cachedRestClient;
    private readonly _authenticator;
    private _baseUris;
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     *
     * @param authenticator The authenticator used to invoke the Verifalia service.
     */
    constructor(authenticator: Authenticator);
    build(): MultiplexedRestClient;
    private getUserAgent;
}
//# sourceMappingURL=VerifaliaRestClientFactory.d.ts.map