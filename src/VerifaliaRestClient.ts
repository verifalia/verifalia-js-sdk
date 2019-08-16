import { IAuthenticator } from "./security/IAuthenticator";
import { UsernamePasswordAuthenticator } from "./security/UsernamePasswordAuthenticator";
import { EmailValidationsRestClient } from "./email-validations/EmailValidationsRestClient";
import { IRestClientFactory } from "./IRestClientFactory";
import { MultiplexedRestClient } from "./MultiplexedRestClient";
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
import { version as packageVersion } from './version';

/**
 * HTTPS-based REST client for Verifalia.
 */
export class VerifaliaRestClient implements IRestClientFactory {
    /**
     * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
     * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
     */
    public apiVersion: string = 'v2.0';

    /**
     * Allows to manage the credits for the Verifalia account.
     */
    public readonly credits = new CreditsRestClient(this);

    /**
     * Allows to submit and manage email validations using the Verifalia service.
     */
    public readonly emailValidations = new EmailValidationsRestClient(this);

    private _authenticator: IAuthenticator;
    private _baseUris = [
        'https://api-1.verifalia.com',
        'https://api-2.verifalia.com',
        'https://api-3.verifalia.com',
    ];
    private _cachedRestClient: MultiplexedRestClient | undefined;

    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified configuration.
     * @param config Contains the configuration for the Verifalia API client, including the credentials
     * to use while authenticating to the Verifalia service.
     */
    constructor(config: VerifaliaRestClientConfiguration) {
        if (!config) throw new Error('config is null');
        if (!config.username) throw new Error('username is null');

        this._authenticator = new UsernamePasswordAuthenticator(config.username, config.password);

        // TODO: Support for client certificates
    }

    /** @internal */
    build(): MultiplexedRestClient {
        if (!this._cachedRestClient) {
            // TODO: Initial uris shuffling

            const uris = this._baseUris.map((uri) => `${uri}/${this.apiVersion}`);

            this._cachedRestClient = new MultiplexedRestClient(this._authenticator,
                this.getUserAgent(),
                uris);
        }

        return this._cachedRestClient as MultiplexedRestClient;
    }

    /** @internal */
    private getUserAgent() {
        const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
        const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof navigator !== 'undefined';

        let userAgent = `verifalia-rest-client/js/${packageVersion}`;
        
        if (isNode) {
            userAgent += `/node/${process.platform + '/' + process.version}`;
        }
        else if (isBrowser) {
            userAgent += `/browser/${navigator.userAgent}`;
        }

        return userAgent;
    }
}