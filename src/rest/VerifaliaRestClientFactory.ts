import { Authenticator } from "./security/Authenticator";
import { RestClientFactory } from "./RestClientFactory";
import { MultiplexedRestClient } from "./MultiplexedRestClient";
import { version as packageVersion } from '../version';

/**
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
export class VerifaliaRestClientFactory implements RestClientFactory {
    /**
     * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
     * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
     */
    public apiVersion: string = 'v2.2';

    private _cachedRestClient: MultiplexedRestClient | undefined;

    private readonly _authenticator: Authenticator;
    private _baseUris = [
        'https://api-1.verifalia.com',
        'https://api-2.verifalia.com',
        'https://api-3.verifalia.com',
    ];

    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     * @param authenticator The authenticator used to invoke the Verifalia service.
     */
    constructor(authenticator: Authenticator) {
        if (!authenticator)
            throw new Error('authenticator is null');

        this._authenticator = authenticator;
    }

    build(): MultiplexedRestClient {
        if (!this._cachedRestClient) {
            // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)
            let shuffledUris = [...this._baseUris];

            for (let i = shuffledUris.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledUris[i], shuffledUris[j]] = [shuffledUris[j], shuffledUris[i]];
            }

            this._cachedRestClient = new MultiplexedRestClient(this._authenticator,
                shuffledUris.map((uri) => `${uri}/${this.apiVersion}`),
                this.getUserAgent());
        }

        return this._cachedRestClient as MultiplexedRestClient;
    }

    private getUserAgent(): string | undefined {
        const isNode = (typeof process !== 'undefined') && process.versions?.node;

        if (isNode) {
            return `verifalia-rest-client/js/${packageVersion}/node/${process.platform + '/' + process.version},target:${'/*@echo TARGET*/'},format:${'/*@echo FORMAT*/'}`;
        }

        // Since we can't force the User-Agent header in the browser, we return it as undefined here so that
        // the related header won't be set later, while making requests to the API.

        return undefined;
    }
}