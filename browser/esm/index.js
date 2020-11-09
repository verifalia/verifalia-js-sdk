// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter } from 'tslib';
import { a as submitEmailValidationFile, s as submitEmailValidation, g as getEmailValidation, d as deleteEmailValidation, l as listEmailValidations, V as VerifaliaError, O as OperationCanceledError } from './index-12b950ea.js';
export { O as OperationCanceledError, W as WaitingStrategy, d as deleteEmailValidation, g as getEmailValidation, l as listEmailValidations, s as submitEmailValidation, a as submitEmailValidationFile } from './index-12b950ea.js';
export { DeduplicationMode_Off, DeduplicationMode_Relaxed, DeduplicationMode_Safe, QualityLevelName_Extreme, QualityLevelName_High, QualityLevelName_Standard, ValidationEntryClassification_Deliverable, ValidationEntryClassification_Risky, ValidationEntryClassification_Undeliverable, ValidationEntryClassification_Unknown, ValidationEntryStatus_AtSignNotFound, ValidationEntryStatus_CatchAllConnectionFailure, ValidationEntryStatus_CatchAllValidationTimeout, ValidationEntryStatus_DnsConnectionFailure, ValidationEntryStatus_DnsQueryTimeout, ValidationEntryStatus_DomainDoesNotExist, ValidationEntryStatus_DomainHasNullMx, ValidationEntryStatus_DomainIsMisconfigured, ValidationEntryStatus_DomainIsWellKnownDea, ValidationEntryStatus_DomainPartCompliancyFailure, ValidationEntryStatus_DoubleDotSequence, ValidationEntryStatus_Duplicate, ValidationEntryStatus_InvalidAddressLength, ValidationEntryStatus_InvalidCharacterInSequence, ValidationEntryStatus_InvalidEmptyQuotedWord, ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence, ValidationEntryStatus_InvalidLocalPartLength, ValidationEntryStatus_InvalidWordBoundaryStart, ValidationEntryStatus_IspSpecificSyntaxFailure, ValidationEntryStatus_LocalEndPointRejected, ValidationEntryStatus_LocalPartIsWellKnownRoleAccount, ValidationEntryStatus_LocalSenderAddressRejected, ValidationEntryStatus_MailExchangerIsHoneypot, ValidationEntryStatus_MailExchangerIsWellKnownDea, ValidationEntryStatus_MailboxConnectionFailure, ValidationEntryStatus_MailboxDoesNotExist, ValidationEntryStatus_MailboxIsDea, ValidationEntryStatus_MailboxTemporarilyUnavailable, ValidationEntryStatus_MailboxValidationTimeout, ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes, ValidationEntryStatus_ServerIsCatchAll, ValidationEntryStatus_ServerTemporaryUnavailable, ValidationEntryStatus_SmtpConnectionFailure, ValidationEntryStatus_SmtpConnectionTimeout, ValidationEntryStatus_SmtpDialogError, ValidationEntryStatus_Success, ValidationEntryStatus_UnacceptableDomainLiteral, ValidationEntryStatus_UnbalancedCommentParenthesis, ValidationEntryStatus_UnexpectedQuotedPairSequence, ValidationEntryStatus_UnhandledException, ValidationEntryStatus_UnmatchedQuotedPair, ValidationPriority_Highest, ValidationPriority_Lowest, ValidationPriority_Normal, ValidationStatus_Completed, ValidationStatus_Deleted, ValidationStatus_Expired, ValidationStatus_InProgress } from './email-validations/constants.js';
import { getCreditsBalance, listCreditsDailyUsages } from './credits/functions.js';
export { getCreditsBalance, listCreditsDailyUsages } from './credits/functions.js';

class EmailValidationsRestClient {
    constructor(restClientFactory) {
        this._restClientFactory = restClientFactory;
    }
    /**
     * Submits one or more email addresses for validation. By default, this method does not wait for
     * the completion of the email validation job: pass a `WaitingStrategy` (or `true`, to wait
     * until the job is completed) to request a different waiting behavior.
     * This method accepts a wide range of input types, including:
     * - `string` and `string[]`
     * - `ValidationRequestEntry` and `ValidationRequestEntry[]`
     * - `ValidationRequest`
     * - `FileValidationRequest`
     *
     * Here is the simplest case, showing how to validate one email address:
     * ```ts
     * // Option 1 - async/await
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const result = await verifalia
     *     .emailValidations
     *     .submit('batman@gmail.com', true);
     *
     * console.log(result.entries[0].classification); // 'Deliverable'
     *
     * // Option 2 - callback
     *
     * const verifalia = new VerifaliaRestClient(...);
     * verifalia
     *     .emailValidations
     *     .submit('batman@gmail.com', true)
     *     .then(result => {
     *         console.log(result.entries[0].classification); // 'Deliverable'
     *     });
     * ```
     *
     * To validate multiple email addresses at once, just submit an array of strings:
     * ```ts
     * // Option 1 - async/await
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const result = await verifalia
     *     .emailValidations
     *     .submit([ 'batman@gmail.com', 'robin1940@yahoo.com' ], true);
     *
     * result.entries.forEach((item) => {
     *     console.log(`${item.inputData}: ${item.classification}`);
     * }); // 'batman@gmail.com: Deliverable' 'robin1940@yahoo.com: Undeliverable'
     *
     * // Option 2 - callback
     *
     * const verifalia = new VerifaliaRestClient(...);
     * verifalia
     *     .emailValidations
     *     .submit([ 'batman@gmail.com', 'robin1940@yahoo.com' ], true);
     *     .then(result => {
     *         result.entries.forEach((item) => {
     *             console.log(`${item.inputData}: ${item.classification}`);
     *         }); // 'batman@gmail.com: Deliverable' 'robin1940@yahoo.com: Undeliverable'
     *     });
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     * @param request An object with one or more email addresses to validate. Can be of type `string`, `string[]`,
     * `ValidationRequestEntry`, `ValidationRequestEntry[]`, `ValidationRequest`, `FileValidationRequest`.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the
     * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
     * advanced scenarios and progress tracking.
     */
    submit(request, waitingStrategy, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use the "file" field as a discriminator to detect whether the argument is a FileValidationRequest
            // or not.
            if (request.file) {
                return submitEmailValidationFile(this._restClientFactory, request, waitingStrategy, cancellationToken);
            }
            return submitEmailValidation(this._restClientFactory, request, waitingStrategy, cancellationToken);
        });
    }
    /**
     * Returns an email validation job previously submitted for processing. By default, this method does
     * not wait for the eventual completion of the email validation job: pass a `WaitingStrategy` (or `true`,
     * to wait until the job is completed) to request a different waiting behavior.
     *
     * Here is how to retrieve an email validation job, given its ID:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * await verifalia
     *     .emailValidations
     *     .get('JOB-ID-HERE'); // validation.id (returned by submit() or list())
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     * @param id The ID of the email validation job to retrieve.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
     * validation.
     */
    get(id, waitingStrategy, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return getEmailValidation(this._restClientFactory, id, waitingStrategy, cancellationToken);
        });
    }
    /**
     * Deletes an email validation job previously submitted for processing.
     *
     * Here is how to delete an email validation job:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * await verifalia
     *     .emailValidations
     *     .delete('JOB-ID-HERE'); // validation.id (returned by submit(), get() or list())
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     * @param id The ID of the email validation job to delete.
     */
    delete(id, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return deleteEmailValidation(this._restClientFactory, id, cancellationToken);
        });
    }
    /**
     * Lists all the email validation jobs, according to the specified listing options.
     *
     * Here is how to list all the jobs submitted on a specific date:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * const validations = verifalia
     *     .emailValidations
     *     .list({
     *         createdOn: new DateEqualityPredicate(new Date(2020, 10, 15))
     *     });
     *
     * for await (const validation of validations) {
     *     console.log(`ID: ${validation.id}, submitted: ${validation.submittedOn}`);
     * }
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     * @param options The options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    list(options, cancellationToken) {
        return listEmailValidations(this._restClientFactory, options, cancellationToken);
    }
}

class CreditsRestClient {
    constructor(restClientFactory) {
        this._restClientFactory = restClientFactory;
    }
    /**
     * Returns the current credits balance for the Verifalia account.
     *
     * Here is an example:
     * ```ts
     * // Option 1 - async/await
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const balance = await verifalia
     *     .credits
     *     .getBalance();
     *
     * console.log(`Credit packs: ${balance.creditPacks}, free credits: ${balance.freeCredits}`);
     * // 'Credit packs: 507.23, free credits: 10.86'
     *
     * // Option 2 - callback
     *
     * const verifalia = new VerifaliaRestClient(...);
     * verifalia
     *     .credits
     *     .getBalance()
     *     .then(balance => {
     *         console.log(`Credit packs: ${balance.creditPacks}, free credits: ${balance.freeCredits}`);
     *         // 'Credit packs: 507.23, free credits: 10.86'
     *     });
     * ```
     *
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    getBalance(cancellationToken) {
        return getCreditsBalance(this._restClientFactory, cancellationToken);
    }
    /**
     * Lists the daily usages of the credits for the Verifalia account, according to the specified
     * listing options.
     *
     * Here is how to list the credit daily usages between two dates:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * const dailyUsages = verifalia
     *     .credits
     *     .listDailyUsages({
     *         dateFilter: new DateBetweenPredicate(new Date(2020, 10, 15), new Date(2020, 10, 23))
     *     });
     *
     * for await (const dailyUsage of dailyUsages) {
     *     console.log(`Date: ${dailyUsage.date}, credit packs: ${dailyUsage.creditPacks}, free credits: ${dailyUsage.freeCredits}`);
     *     // 'Date: 2020-10-15, credit packs: 98.85, free credits: 50'
     *     // 'Date: 2020-10-16, credit packs: 0, free credits: 19.26'
     *     // ...
     *     // 'Date: 2020-10-23, credit packs: 1.565, free credits: 50'
     * }
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     * @param options A `DailyUsageListingOptions` with the options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    listDailyUsages(options, cancellationToken) {
        return listCreditsDailyUsages(this._restClientFactory, options, cancellationToken);
    }
}

/**
 * Thrown in the event all the Verifalia API endpoints are unreachable.
 */
class ServiceUnreachableError extends VerifaliaError {
    /**
     *
     */
    constructor(innerErrors) {
        super(`All the base URIs are unreachable: ${innerErrors.map(error => error).join(', ')}`);
        this.innerErrors = innerErrors;
    }
}

/**
 * Thrown in the rare event a Verifalia API endpoint returns an HTTP server error status code (HTTP 5xx).
 */
class EndpointServerError extends VerifaliaError {
}

/**
 * Thrown in the event the user is unable to authenticate to Verifalia.
 */
class AuthorizationError extends VerifaliaError {
}

/**
 * Thrown in the event a request exceeded the maximum configured email validations rate or the maximum number
 * of concurrent requests from the same IP address.
 */
class RequestThrottledError extends VerifaliaError {
    constructor() {
        super(`The current request has been throttled; please try again later.`);
    }
}

/**
 * Thrown when the credit of the requesting account is not enough to accept a given
 * email validation job.
 */
class InsufficientCreditError extends VerifaliaError {
    constructor() {
        super(`The credit of the requesting account is too low to complete the operation.`);
    }
}

const MimeContentType_ApplicationJson = 'application/json';
/**
 * Plain-text files (.txt), with one email address per line.
 */
const MimeContentType_TextPlain = 'text/plain';
/**
 * Comma-separated values (.csv).
 */
const MimeContentType_TextCsv = 'text/csv';
/**
 * Tab-separated values (usually coming with the .tsv extension).
 */
const MimeContentType_TextTsv = 'text/tab-separated-values';
/**
 * Microsoft Excel 97-2003 Worksheet (.xls).
 */
const MimeContentType_ExcelXls = 'application/vnd.ms-excel';
/**
 * Microsoft Excel workbook (.xslx).
 */
const MimeContentType_ExcelXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

class MultiplexedRestClient {
    constructor(authenticator, baseUris, userAgent = undefined) {
        if (!authenticator)
            throw new Error('authenticator is null');
        if (!baseUris || !baseUris.length)
            throw new Error('baseUris is null or empty');
        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
    }
    invoke(method, resource, params, data, configOverride, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            const abortController = new AbortController();
            const onCanceled = () => abortController.abort();
            if (cancellationToken) {
                cancellationToken.register(onCanceled);
            }
            try {
                for (let idxUri = 0; idxUri < this._baseUris.length; idxUri++) {
                    const baseUri = this._baseUris[idxUri];
                    let requestInit = {
                        method: method,
                        body: data && data instanceof FormData
                            ? data
                            : JSON.stringify(data),
                        redirect: 'manual',
                        headers: {
                            // Default accepted MIME content type
                            'Accept': MimeContentType_ApplicationJson
                        }
                    };
                    // Cancellation support
                    if (cancellationToken) {
                        requestInit.signal = abortController.signal;
                    }
                    // Adds the user-agent header only if it has been specified (can't be forced in the browser)
                    if (this._userAgent) {
                        requestInit.headers = Object.assign(Object.assign({}, requestInit.headers), { 'User-Agent': this._userAgent });
                    }
                    if (method === 'POST' || method === 'PUT') {
                        requestInit.headers = Object.assign(Object.assign({}, requestInit.headers), { 
                            // Default posted MIME content type
                            'Content-Type': MimeContentType_ApplicationJson });
                    }
                    requestInit = Object.assign(Object.assign({}, requestInit), configOverride);
                    yield this._authenticator.decorateRequest(this, requestInit);
                    const queryString = params
                        ? Object
                            .entries(params)
                            .map(([key]) => `${key}=${encodeURIComponent(params[key])}`)
                            .join('&')
                        : null;
                    const url = `${baseUri}${resource}${queryString ? '?' + queryString : ''}`;
                    // Display outgoing requests to the API on the console (debug build only)
                    let response;
                    try {
                        response = yield fetch(url, requestInit);
                    }
                    catch (error) {
                        if (error.name === 'AbortError') {
                            // The request has been canceled
                            throw new OperationCanceledError();
                        }
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
                        throw new AuthorizationError(response.statusText + (yield response.text()) + ' ' + url);
                    }
                    // Payment required
                    if (response.status === 402) {
                        throw new InsufficientCreditError();
                    }
                    // Throttling
                    if (response.status === 429) {
                        throw new RequestThrottledError();
                    }
                    return {
                        status: response.status,
                        statusText: response.statusText,
                        body: response.body,
                        deserialize: () => __awaiter(this, void 0, void 0, function* () { return (yield response.json()); })
                    };
                }
                throw new ServiceUnreachableError(errors);
            }
            finally {
                if (cancellationToken) {
                    cancellationToken.unregister(onCanceled);
                }
            }
        });
    }
}

// generated by genversion
const version = '3.0.0';

/**
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
class VerifaliaRestClientFactory {
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     * @param authenticator The authenticator used to invoke the Verifalia service.
     */
    constructor(authenticator) {
        /**
         * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
         * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
         */
        this.apiVersion = 'v2.2';
        this._baseUris = [
            'https://api-1.verifalia.com',
            'https://api-2.verifalia.com',
            'https://api-3.verifalia.com',
        ];
        if (!authenticator)
            throw new Error('authenticator is null');
        this._authenticator = authenticator;
    }
    build() {
        if (!this._cachedRestClient) {
            // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)
            let shuffledUris = [...this._baseUris];
            for (let i = shuffledUris.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledUris[i], shuffledUris[j]] = [shuffledUris[j], shuffledUris[i]];
            }
            this._cachedRestClient = new MultiplexedRestClient(this._authenticator, shuffledUris.map((uri) => `${uri}/${this.apiVersion}`), this.getUserAgent());
        }
        return this._cachedRestClient;
    }
    getUserAgent() {
        var _a;
        const isNode = (typeof process !== 'undefined') && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node);
        if (isNode) {
            return `verifalia-rest-client/js/${version}/node/${process.platform + '/' + process.version},target:${'browser'},format:${'es'}`;
        }
        // Since we can't force the User-Agent header in the browser, we return it as undefined here so that
        // the related header won't be set later, while making requests to the API.
        return undefined;
    }
}

class UsernamePasswordAuthenticator {
    constructor(username, password) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }
        this._username = username;
        this._password = password;
    }
    decorateRequest(restClient, requestInit) {
        requestInit.headers = Object.assign(Object.assign({}, requestInit.headers), { 'Authorization': 'Basic ' +
                btoa(this._username + ":" + this._password) });
        return Promise.resolve();
    }
}

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
class VerifaliaRestClient {
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified configuration.
     * @param config Contains the configuration for the Verifalia API client, including the credentials
     * to use while authenticating to the Verifalia service.
     */
    constructor(config) {
        if (!config)
            throw new Error('config is null');
        if (!config.username)
            throw new Error('username is null');
        // Builds the authenticator
        // TODO: Support X.509 client certificate authentication (on Node)
        const authenticator = new UsernamePasswordAuthenticator(config.username, config.password);
        this._restClientfactory = new VerifaliaRestClientFactory(authenticator);
        this.credits = new CreditsRestClient(this._restClientfactory);
        this.emailValidations = new EmailValidationsRestClient(this._restClientfactory);
    }
}

class FilterPredicate {
}

class DateFilterPredicate extends FilterPredicate {
}

// Adapted from https://stackoverflow.com/a/23593099/904178
function formatDateToIso8601(date) {
    const month = '' + (date.getMonth() + 1);
    const day = '' + date.getDate();
    const year = date.getFullYear();
    return [
        year,
        month.length < 2 ? '0' + month : month,
        day.length < 2 ? '0' + day : day
    ].join('-');
}

class DateEqualityPredicate extends DateFilterPredicate {
    constructor(date) {
        super();
        this.date = date;
    }
    serialize(fieldName) {
        return [
            {
                key: fieldName,
                value: `${formatDateToIso8601(this.date)}`
            }
        ];
    }
}

class DateBetweenPredicate extends DateFilterPredicate {
    constructor(since, until) {
        super();
        this.since = since;
        this.until = until;
    }
    serialize(fieldName) {
        const fragments = [];
        if (this.since) {
            fragments.push({
                key: `${fieldName}:since`,
                value: formatDateToIso8601(this.since)
            });
        }
        if (this.until) {
            fragments.push({
                key: `${fieldName}:until`,
                value: formatDateToIso8601(this.until)
            });
        }
        return fragments;
    }
}

class CancellationToken {
    constructor() {
        this._isCanceled = false;
        this._callbacks = [];
    }
    isCanceled() {
        return this._isCanceled;
    }
    register(callback) {
        if (this._isCanceled) {
            callback();
            return;
        }
        this._callbacks.push(callback);
    }
    unregister(callback) {
        const index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }
    cancel() {
        this._isCanceled = true;
        for (const callback of this._callbacks) {
            callback();
        }
        this._callbacks = [];
    }
    throwIfCancellationRequested() {
        if (this.isCanceled()) {
            throw new OperationCanceledError();
        }
    }
}

export { AuthorizationError, CancellationToken, CreditsRestClient, DateBetweenPredicate, DateEqualityPredicate, EmailValidationsRestClient, EndpointServerError, InsufficientCreditError, MimeContentType_ApplicationJson, MimeContentType_ExcelXls, MimeContentType_ExcelXlsx, MimeContentType_TextCsv, MimeContentType_TextPlain, MimeContentType_TextTsv, RequestThrottledError, ServiceUnreachableError, UsernamePasswordAuthenticator, VerifaliaRestClient, VerifaliaRestClientFactory };
