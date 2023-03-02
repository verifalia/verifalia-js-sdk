/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2023 Cobisi Research
 * 
 * Cobisi Research
 * Via Della Costituzione, 31
 * 35010 Vigonza
 * Italy - European Union
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { EmailValidationsRestClient } from "./email-validations/EmailValidationsRestClient";
import { RestClientFactory } from "./rest/RestClientFactory";
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
import { VerifaliaRestClientFactory } from "./rest/VerifaliaRestClientFactory";
import { UsernamePasswordAuthenticator } from "./rest/security/UsernamePasswordAuthenticator";
import { ClientCertificateAuthenticator } from "./rest/security/ClientCertificateAuthenticator";
import { Authenticator } from "./rest/security/Authenticator";

/* @if ENVIRONMENT!='production' */
import { Logger } from "./diagnostics/Logger";
const logger = new Logger('verifalia');
/* @endif */

/**
 * HTTPS-based REST client for Verifalia. This is the starting point to every other operation against
 * the Verifalia API, it allows to easily verify email addresses, manage submitted email validation
 * jobs and operate on the credits of the account.
 * 
 * To submit and manage email validations, use the methods exposed by the `emailValidations` field.
 * To manage the credits for the Verifalia account, use the methods exposed by the `credits` field.
 * 
 * Using this class requires to have a Verifalia account: if you don't yet have one, just register
 * for free at https://verifalia.com/sign-up/free
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
     * This constructor accepts either the user-name and password credentials of your root
     * Verifalia account, those of a Verifalia user (previously known as sub-accounts) or a Verifalia
     * browser app's key. As an alternative to the above, it is also possible to specify an X.509
     * client certificate for mutual TLS client authentication (only available in Node.js).
     * 
     * For security reasons, it is always advisable to create and use a dedicated user for accessing
     * the Verifalia API, as doing so will allow to assign only the specific needed permissions to it.
     * 
     * Here is how to create an instance of this class with a user-name and password pair:
     * ```ts
     * const verifalia = new VerifaliaRestClient({
     *   username: 'johndoe',
     *   password: 'mysecretpa$$word'
     * });
     * ```
     * 
     * To use a browser app, pass its app key through the `username` field:
     * ```ts
     * const verifalia = new VerifaliaRestClient({
     *   username: '0a0321de08f54d3caff43951311bf958'
     * });
     * ```
     * 
     * To authenticate using an X.509 client certificate (only available in Node.js), specify its public
     * key using the `cert` field and its private key with the `key` field:
     * ```ts
     * const verifalia = new VerifaliaRestClient({
     *   cert: fs.readFileSync('/home/rmontagnani/my-client-certificate.pem'),
     *   key: fs.readFileSync('/home/rmontagnani/my-client-certificate.key')
     * });
     * ```
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
        else if (config.cert && config.key) {
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