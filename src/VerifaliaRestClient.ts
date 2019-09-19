import { Authenticator } from "./security/Authenticator";
import { UsernamePasswordAuthenticator } from "./security/UsernamePasswordAuthenticator";
import { EmailValidationsRestClient } from "./email-validations/EmailValidationsRestClient";
import { RestClientFactory } from "./RestClientFactory";
import { MultiplexedRestClient } from "./MultiplexedRestClient";
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
import { version as packageVersion } from './version';

/**
 * HTTPS-based REST client for Verifalia.
 */
export class VerifaliaRestClient implements RestClientFactory {
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

    private readonly _authenticator: Authenticator;
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

    build(): MultiplexedRestClient {
        if (!this._cachedRestClient) {
            // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)

            let shuffledUris = [ ...this._baseUris ];

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
        const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

        if (isNode) {
            return `verifalia-rest-client/js/${packageVersion}/node/${process.platform + '/' + process.version}`;
        }

        // Since we can't force the User-Agent header in the browser, we return it as undefined here so that
        // the related header won't be set later, while making requests to the API.

        return undefined;
    }
}