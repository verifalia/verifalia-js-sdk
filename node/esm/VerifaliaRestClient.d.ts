/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 *
 * Copyright (c) 2005-2024 Cobisi Research
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
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
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
export declare class VerifaliaRestClient {
    /**
     * Default Verifalia base URIs.
     */
    private _baseUris;
    /**
     * Default Verifalia base URIs for client-certificate authentication.
     */
    private _baseCcaUris;
    private readonly _restClientFactory;
    /**
     * Allows to manage the credits for the Verifalia account.
     */
    readonly credits: CreditsRestClient;
    /**
     * Allows to submit and manage email validations using the Verifalia service.
     */
    readonly emailValidations: EmailValidationsRestClient;
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
    constructor(config: VerifaliaRestClientConfiguration);
}
//# sourceMappingURL=VerifaliaRestClient.d.ts.map