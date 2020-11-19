import { EmailValidationsRestClient } from "./email-validations/EmailValidationsRestClient";
import { CreditsRestClient } from "./credits/CreditsRestClient";
import { VerifaliaRestClientConfiguration } from "./VerifaliaRestClientConfiguration";
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
export declare class VerifaliaRestClient {
    private _restClientfactory;
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
     * @param config Contains the configuration for the Verifalia API client, including the credentials
     * to use while authenticating to the Verifalia service.
     */
    constructor(config: VerifaliaRestClientConfiguration);
}
//# sourceMappingURL=VerifaliaRestClient.d.ts.map