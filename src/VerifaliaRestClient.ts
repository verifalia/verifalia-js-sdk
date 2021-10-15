import { EmailValidationsRestClient } from "./email-validations/EmailValidationsRestClient";
import { RestClientFactory } from "./rest/RestClientFactory";
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
import { VerifaliaRestClientFactory } from "./rest/VerifaliaRestClientFactory";
import { UsernamePasswordAuthenticator } from "./rest/security/UsernamePasswordAuthenticator";

/* @if ENVIRONMENT!='production' */
import { Logger } from "./diagnostics/Logger";
import { ClientCertificateAuthenticator } from "./rest/security/ClientCertificateAuthenticator";
import { Authenticator } from "./rest/security/Authenticator";
const logger = new Logger('verifalia');
/* @endif */

/**
 * HTTPS-based REST client for Verifalia. This is the starting point to every other operation against
 * the Verifalia API, it allows to easily validate email addresses, manage submitted email validation
 * jobs and operate on the credits of the account.
 * 
 * To submit and manage email validations, use the methods exposed by the `emailValidations` field.
 * To manage the credits for the Verifalia account, use the methods exposed by the `credits` field.
 * 
 * This class constructor accepts the credentials of your root Verifalia account or of one of its users
 * (previously known as sub-accounts): if you don't have a Verifalia account, just register for a free
 * one at https://verifalia.com/sign-up/free. For security reasons, it is always advisable to create
 * and use a dedicated user for accessing the API, as doing so will allow to assign only the specific
 * needed permissions to it.
 * 
 * Here is how to create an instance of this class:
 * ```ts
 * const verifalia = new VerifaliaRestClient({
 *   username: 'johndoe',
 *   password: 'mysecretpa$$word'
 * });
 * ```
 */
export class VerifaliaRestClient {
    /**
     * Default Verifalia base URIs.
     */
    private _baseUris = [
        'https://api-1.verifalia.com',
        'https://api-2.verifalia.com',
        'https://api-3.verifalia.com',
    ];

    /**
     * Default Verifalia base URIs for client-certificate authentication.
     */
    private _baseCcaUris = [
        'https://api-cca-1.verifalia.com',
        'https://api-cca-2.verifalia.com',
        'https://api-cca-3.verifalia.com',
    ];

    private _restClientfactory: RestClientFactory;

    /**
     * Allows to manage the credits for the Verifalia account.
     */
    public readonly credits: CreditsRestClient;

    /**
     * Allows to submit and manage email validations using the Verifalia service.
     */
    public readonly emailValidations: EmailValidationsRestClient;

    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified configuration.
     *
     * @param config Contains the configuration for the Verifalia API client, including the credentials
     * to use while authenticating to the Verifalia service.
     */
    constructor(config: VerifaliaRestClientConfiguration) {
        if (!config) throw new Error('config is null');

        /* @if ENVIRONMENT!='production' */
        logger.log('Compilation', '/*@echo TARGET*/', '/*@echo FORMAT*/');
        /* @endif */
    
        // Builds the authenticator

        let authenticator: Authenticator;
        let baseUris: string[];

        if (config.username) {
            // User-name password authentication

            authenticator = new UsernamePasswordAuthenticator(config.username, config.password);
            baseUris = config.baseUris ?? this._baseUris;
        }
        /* @if TARGET='node' */
        else if (config.cert) {
            // X.509 client certificate authentication (Node.js only)

            authenticator = new ClientCertificateAuthenticator(config.cert, config.key, config.passphrase);
            baseUris = config.baseUris ?? this._baseCcaUris;
        }
        /* @endif */
        else {
            /* @if TARGET='node' */
            throw new Error('Invalid configuration: either specify your user credentials, your browser-app key or your client certificate.');
            /* @else */
            throw new Error('Invalid configuration: either specify your user credentials or your browser-app key.');
            /* @endif */
        }

        this._restClientfactory = new VerifaliaRestClientFactory(authenticator, baseUris);
        
        this.credits = new CreditsRestClient(this._restClientfactory);
        this.emailValidations = new EmailValidationsRestClient(this._restClientfactory);
    }
}