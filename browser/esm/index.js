// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter } from 'tslib';
import { a as submitEmailValidationFile, s as submitEmailValidation, g as getEmailValidation, d as deleteEmailValidation, l as listEmailValidations, e as exportEmailValidationEntries, V as VerifaliaError, O as OperationCanceledError } from './index-08f19523.js';
export { O as OperationCanceledError, W as WaitOptions, d as deleteEmailValidation, e as exportEmailValidationEntries, g as getEmailValidation, l as listEmailValidations, s as submitEmailValidation, a as submitEmailValidationFile } from './index-08f19523.js';
export { DeduplicationMode_Off, DeduplicationMode_Relaxed, DeduplicationMode_Safe, QualityLevelName_Extreme, QualityLevelName_High, QualityLevelName_Standard, ValidationEntryClassification_Deliverable, ValidationEntryClassification_Risky, ValidationEntryClassification_Undeliverable, ValidationEntryClassification_Unknown, ValidationEntryStatus_AtSignNotFound, ValidationEntryStatus_CatchAllConnectionFailure, ValidationEntryStatus_CatchAllValidationTimeout, ValidationEntryStatus_DnsConnectionFailure, ValidationEntryStatus_DnsQueryTimeout, ValidationEntryStatus_DomainDoesNotExist, ValidationEntryStatus_DomainHasNullMx, ValidationEntryStatus_DomainIsMisconfigured, ValidationEntryStatus_DomainIsWellKnownDea, ValidationEntryStatus_DomainPartCompliancyFailure, ValidationEntryStatus_DoubleDotSequence, ValidationEntryStatus_Duplicate, ValidationEntryStatus_InvalidAddressLength, ValidationEntryStatus_InvalidCharacterInSequence, ValidationEntryStatus_InvalidEmptyQuotedWord, ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence, ValidationEntryStatus_InvalidLocalPartLength, ValidationEntryStatus_InvalidWordBoundaryStart, ValidationEntryStatus_IspSpecificSyntaxFailure, ValidationEntryStatus_LocalEndPointRejected, ValidationEntryStatus_LocalPartIsWellKnownRoleAccount, ValidationEntryStatus_LocalSenderAddressRejected, ValidationEntryStatus_MailExchangerIsHoneypot, ValidationEntryStatus_MailExchangerIsParked, ValidationEntryStatus_MailExchangerIsWellKnownDea, ValidationEntryStatus_MailboxConnectionFailure, ValidationEntryStatus_MailboxDoesNotExist, ValidationEntryStatus_MailboxIsDea, ValidationEntryStatus_MailboxTemporarilyUnavailable, ValidationEntryStatus_MailboxValidationTimeout, ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes, ValidationEntryStatus_ServerIsCatchAll, ValidationEntryStatus_ServerTemporaryUnavailable, ValidationEntryStatus_SmtpConnectionFailure, ValidationEntryStatus_SmtpConnectionTimeout, ValidationEntryStatus_SmtpDialogError, ValidationEntryStatus_Success, ValidationEntryStatus_UnacceptableDomainLiteral, ValidationEntryStatus_UnbalancedCommentParenthesis, ValidationEntryStatus_UnexpectedQuotedPairSequence, ValidationEntryStatus_UnhandledException, ValidationEntryStatus_UnmatchedQuotedPair, ValidationPriority_Highest, ValidationPriority_Lowest, ValidationPriority_Normal, ValidationStatus_Completed, ValidationStatus_Deleted, ValidationStatus_Expired, ValidationStatus_InProgress } from './email-validations/constants.js';
import { getCreditsBalance, listCreditsDailyUsages } from './credits/functions.js';
export { getCreditsBalance, listCreditsDailyUsages } from './credits/functions.js';

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
class EmailValidationsRestClient {
    constructor(restClientFactory) {
        this._restClientFactory = restClientFactory;
    }
    /**
     * Submits one or more email addresses for validation.
     *
     * This method accepts a wide range of input types, including:
     * - `string` and `string[]`, useful to submit only the email address(es) to verify, using the default
     * processing options;
     * - `ValidationRequestEntry` and `ValidationRequestEntry[]`, allowing to specify an optional custom
     * string (such as a customer ID) along with each email address under test;
     * - `ValidationRequest`, used to fully customize the email verification process;
     * - `FileValidationRequest`, used to import and verify files containing lists of email addresses.
     *
     * By default, this method waits for the completion of the email validation job: pass a `WaitOptions`
     * to request a different waiting behavior.
     *
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * ## How to verify an email address
     *
     * Here is the simplest case, showing how to verify a single email address, using the default processing
     * options:
     *
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit('batman@gmail.com');
     *
     * console.log(result.entries[0].classification); // 'Deliverable'
     * ```
     * It is also possible to pass a `ValidationRequest` to specify any supported processing option, including the
     * desired result quality level and data retention policy:
     *
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit({
     *         entries: [
     *             {
     *                 inputData: 'scottgu@gmail.com',
     *                 // custom: 'foobar123'
     *             }
     *         ],
     *         quality: 'High',
     *         retention: '0:5:0' // 5 minutes
     *     });
     *
     * console.log(result.entries[0].classification); // 'Deliverable'
     * ```
     *
     * ## How to verify multiple email addresses at once
     *
     * To validate multiple email addresses at once, just submit an array of strings:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit([ 'batman@gmail.com', 'robin1940@yahoo.com' ]);
     *
     * result.entries.forEach((item) => {
     *     console.log(`${item.inputData}: ${item.classification}`);
     * }); // 'batman@gmail.com: Deliverable' 'robin1940@yahoo.com: Undeliverable'
     * ```
     *
     * As seen in the section above, it is also possible to pass a `ValidationRequest` to specify
     * any supported processing option, including the desired result quality level and data retention
     * policy:
     *
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit({
     *         entries: [
     *             {
     *                 inputData: 'scottgu@gmail.com',
     *                 // custom: 'foobar'
     *             },
     *             {
     *                 inputData: 'robin1940@yahoo.com',
     *                 // custom: '42'
     *             },
     *         ],
     *         quality: 'Extreme',
     *         retention: '1:30:0' // 1 hour and 30 minutes
     *     });
     *
     * result.entries.forEach((item) => {
     *     console.log(`${item.inputData}: ${item.classification}`);
     * }); // 'batman@gmail.com: Deliverable' 'robin1940@yahoo.com: Undeliverable'
     * ```
     *
     * ## Import and verify a list of email addresses
     *
     * To import and submit a file with the email addresses to verify, pass a `FileValidationRequest`
     * to this method, with the `file` field assigned to an instance of one of these supported types:
     * - `ReadStream` or a `Buffer` (Node.js), or;
     * - `Blob` or a `File` (browser).
     *
     * Here is how to import and verify a list in the CSV file format, in Node.js, using a `ReadStream`:
     * ```ts
     * const fs = require('fs');
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const fileStream = fs.createReadStream('./my-list.csv');
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit({
     *         file: fileStream,
     *         contentType: 'text/csv',
     *         column: 0,
     *         startingRow: 1
     *     });
     *
     * result.entries.forEach((item) => {
     *     console.log(`${item.inputData}: ${item.classification}`);
     * });
     * ```
     *
     * While importing and submitting a file for email verification, it is possible to specify any processing
     * option through the passed `FileValidationRequest` instance, similarly to how one can do that with the
     * `ValidationRequest` class.
     *
     * ```ts
     * const fs = require('fs');
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const fileStream = fs.createReadStream('./my-list.csv');
     *
     * const result = await verifalia
     *     .emailValidations
     *     .submit({
     *         file: fileStream,
     *         contentType: 'text/csv',
     *         column: 0,
     *         startingRow: 1,
     *         quality: 'High',
     *         retention: '0:10:0', // 10 minutes
     *         callback: {
     *             url: 'https://your-website-here/foo/bar'
     *         }
     *     });
     *
     * result.entries.forEach((item) => {
     *     console.log(`${item.inputData}: ${item.classification}`);
     * });
     * ```
     *
     * ## Custom waiting
     *
     * As mentioned, `submit()` automatically waits for the completion of the submitted email
     * verification job. It is however possible, through the `waitOptions` parameter, to customize
     * the waiting behavior of the method.
     *
     * Here is how, for instance, one can enqueue a possibly large email verification job, **without**
     * waiting for its completion:
     *
     * ```ts
     * const job = await verifalia
     *     .emailValidations
     *     .submit(TODO, WaitOptions.noWait);
     *
     * console.log(`${job.overview.status}`); // InProgress
     * ```
     *
     * And here is how to **track the progress** of an email verification job through a custom `WaitOptions` and
     * a `progress` function lambda:
     *
     * ```ts
     * const job = await verifalia
     *     .emailValidations
     *     .submit(TODO,
     *         {
     *             ...new WaitOptions(),
     *             progress: jobOverview => {
     *                 console.log(`% completed: ${jobOverview.progress?.percentage * 100}`);
     *             }
     *         });
     * ```
     *
     * @param request An object with one or more email addresses to validate. Can be of type `string`, `string[]`,
     * `ValidationRequestEntry`, `ValidationRequestEntry[]`, `ValidationRequest`, `FileValidationRequest`.
     * @param waitOptions Optional configuration settings for waiting on the completion of an email validation job.
     * Can be `undefined` (or `null`) to wait for the completion using the default settings, `WaitOptions.noWait` to
     * avoid waiting or an instance of `WaitOptions` for advanced scenarios and progress tracking.
     */
    submit(request, waitOptions, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Use the "file" field as a discriminator to detect whether the argument is a FileValidationRequest
            // or not.
            if (request.file) {
                return submitEmailValidationFile(this._restClientFactory, request, waitOptions, cancellationToken);
            }
            return submitEmailValidation(this._restClientFactory, request, waitOptions, cancellationToken);
        });
    }
    /**
     * Returns an email validation job previously submitted for processing.
     *
     * By default, this method waits for the completion of the email validation job: pass a `WaitOptions`
     * to request a different waiting behavior.
     *
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * Here is how to retrieve an email validation job, given its ID:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * await verifalia
     *     .emailValidations
     *     .get('JOB-ID-HERE'); // validation.id (returned by submit() or list())
     * ```
     *
     * @param id The ID of the email validation job to retrieve.
     * @param waitOptions Optional configuration settings for waiting on the completion of an email validation job.
     * Can be `undefined` (or `null`) to wait for the completion using the default settings, `WaitOptions.noWait` to
     * avoid waiting or an instance of `WaitOptions` for advanced scenarios and progress tracking.
     */
    get(id, waitOptions, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return getEmailValidation(this._restClientFactory, id, waitOptions, cancellationToken);
        });
    }
    /**
     * Deletes an email validation job previously submitted for processing.
     *
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * Here is how to delete an email validation job:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * await verifalia
     *     .emailValidations
     *     .delete('JOB-ID-HERE'); // validation.id (returned by submit(), get() or list())
     * ```
     *
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
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
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
     * @param options The options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    list(options, cancellationToken) {
        return listEmailValidations(this._restClientFactory, options, cancellationToken);
    }
    /**
     * Returns a stream with an export of the specified completed email validation job, with the goal
     * of generating a *human-readable representation* of the results according to the requested output
     * file format. While the output schema (columns / labels / data format) is fairly complete, you
     * should always consider it as subject to change.
     *
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * Here is how to export a job in Microsoft Excel format:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const exportedData = await verifalia
     *     .emailValidations
     *     .export('dc21630a-6773-4bd0-b248-15e8b50c0d3e', MimeContentType_ExcelXlsx);
     *
     * // Either save the spreadsheet to file (Node.js-only):
     *
     * exportedData.pipe(fs.createWriteStream('/home/lbanfi/my-list.xls'));
     *
     * // Or display it in an iframe (browser only):
     *
     * document
     *     .getElementByID('my-iframe')
     *     .src = exportedData.toBlobURL(MimeContentType_ExcelXlsx);
     * ```
     *
     * @param id The ID of the email validation job to retrieve.
     * @param contentType The MIME content-type of output file format. Acceptable values:
     * - text/csv for comma-separated values files - CSV
     * - application/vnd.ms-excel for Microsoft Excel 97-2003 Worksheet (.xls)
     * - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet for Microsoft Excel workbook
     * (.xslx).
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     * @returns A stream with the exported data.
     */
    export(id, contentType, cancellationToken) {
        return exportEmailValidationEntries(this._restClientFactory, id, contentType, cancellationToken);
    }
}

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
class CreditsRestClient {
    constructor(restClientFactory) {
        this._restClientFactory = restClientFactory;
    }
    /**
     * Returns the current credits balance for the Verifalia account.
     *
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * Here is an example:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     *
     * const balance = await verifalia
     *     .credits
     *     .getBalance();
     *
     * console.log(`Credit packs: ${balance.creditPacks}, free credits: ${balance.freeCredits}`);
     * // 'Credit packs: 507.23, free credits: 10.86'
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
     * This method returns a `Promise` which can be consumed using the async/await pattern (or through the
     * classic `then()` / `catch()` functions) and can be cancelled through a `CancellationToken`.
     *
     * Here is how to list the credit daily usages between two dates:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * const dailyUsages = verifalia
     *     .credits
     *     .listDailyUsages({
     *         dateFilter: new DateBetweenPredicate(new Date(2023, 2, 15), new Date(2023, 3, 1))
     *     });
     *
     * for await (const dailyUsage of dailyUsages) {
     *     console.log(`Date: ${dailyUsage.date}, credit packs: ${dailyUsage.creditPacks}, free credits: ${dailyUsage.freeCredits}`);
     *     // 'Date: 2023-02-15, credit packs: 98.85, free credits: 50'
     *     // 'Date: 2023-02-16, credit packs: 0, free credits: 19.26'
     *     // ...
     *     // 'Date: 2023-03-01, credit packs: 1.565, free credits: 50'
     * }
     * ```
     *
     * @param options A `DailyUsageListingOptions` with the options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    listDailyUsages(options, cancellationToken) {
        return listCreditsDailyUsages(this._restClientFactory, options, cancellationToken);
    }
}

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
/**
 * Thrown in the event all the Verifalia API endpoints are unreachable.
 */
class ServiceUnreachableError extends VerifaliaError {
    /**
     *
     */
    constructor(innerErrors) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        super(`All the base URIs are unreachable: ${innerErrors.map(error => `${error}`).join(', ')}`);
        this.innerErrors = innerErrors;
    }
}

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
/**
 * Thrown in the rare event a Verifalia API endpoint returns an HTTP server error status code (HTTP 5xx).
 */
class EndpointServerError extends VerifaliaError {
}

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
/**
 * Thrown in the event the user is unable to authenticate to Verifalia.
 */
class AuthorizationError extends VerifaliaError {
}

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
/**
 * Thrown when the credit of the requesting account is not enough to accept a given
 * email validation job.
 *
 * To add credit packs to your Verifalia account please visit https://verifalia.com/client-area#/credits/add
 */
class InsufficientCreditError extends VerifaliaError {
    constructor() {
        super(`The credit of the requesting account is too low to complete the operation: please visit https://verifalia.com/client-area#/credits/add to add credit packs to your account.`);
    }
}

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
/**
 * JSON content-type.
 */
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
class MultiplexedRestClient {
    constructor(authenticator, baseUris, userAgent = undefined) {
        if (!authenticator)
            throw new Error('authenticator is null');
        if (!baseUris || !baseUris.length)
            throw new Error('baseUris is null or empty');
        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
        this._noOfInvocations = 0;
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
                // We will attempt invoking the Verifalia API a maximum of once per endpoint
                for (let idxAttempt = 0; idxAttempt < this._baseUris.length; idxAttempt++) {
                    const baseUri = this._baseUris[this._noOfInvocations++ % this._baseUris.length];
                    let requestInit = {
                        method,
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
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
                        deserialize: () => __awaiter(this, void 0, void 0, function* () { return (yield response.json()); }),
                        response,
                        // Obsolete fields, for backward compatibility only
                        status: response.status,
                        statusText: response.statusText,
                        body: response.body,
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
const version = '4.0.0';

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
/**
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
class VerifaliaRestClientFactory {
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     *
     * @param authenticator The authenticator used to invoke the Verifalia service.
     * @param baseUris The base Verifalia API endpoints used to invoke the Verifalia service.
     */
    constructor(authenticator, baseUris) {
        /**
         * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
         * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
         */
        this.apiVersion = 'v2.4';
        if (!authenticator)
            throw new Error('authenticator is null');
        if (!baseUris || baseUris.length < 1)
            throw new Error('baseUris is null or has no items');
        this._authenticator = authenticator;
        this._baseUris = baseUris;
    }
    build() {
        if (!this._cachedRestClient) {
            // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)
            const shuffledUris = [...this._baseUris];
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
/**
 * Allows to authenticate against the Verifalia API using with either a username-password
 * credentials pair or with a browser app-key.
 */
class UsernamePasswordAuthenticator {
    constructor(username, password) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }
        this._username = username;
        this._password = password || '';
    }
    decorateRequest(restClient, requestInit) {
        requestInit.headers = Object.assign(Object.assign({}, requestInit.headers), { 'Authorization': 'Basic ' +
                btoa(this._username + ":" + this._password) });
        return Promise.resolve();
    }
}

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
class VerifaliaRestClient {
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
    constructor(config) {
        var _a;
        /**
         * Default Verifalia base URIs.
         */
        this._baseUris = [
            'https://api-1.verifalia.com',
            'https://api-2.verifalia.com',
            'https://api-3.verifalia.com',
        ];
        /**
         * Default Verifalia base URIs for client-certificate authentication.
         */
        this._baseCcaUris = [
            'https://api-cca-1.verifalia.com',
            'https://api-cca-2.verifalia.com',
            'https://api-cca-3.verifalia.com',
        ];
        if (!config)
            throw new Error('config is null');
        // Builds the authenticator
        let authenticator;
        let baseUris;
        if (config.username) {
            // User-name password authentication
            authenticator = new UsernamePasswordAuthenticator(config.username, config.password);
            baseUris = (_a = config.baseUris) !== null && _a !== void 0 ? _a : this._baseUris;
        }
        else {
            throw new Error('Invalid configuration: either specify your user credentials or your browser-app key.');
        }
        this._restClientfactory = new VerifaliaRestClientFactory(authenticator, baseUris);
        this.credits = new CreditsRestClient(this._restClientfactory);
        this.emailValidations = new EmailValidationsRestClient(this._restClientfactory);
    }
}

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
class FilterPredicate {
}

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
class DateFilterPredicate extends FilterPredicate {
}

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
// Adapted from https://stackoverflow.com/a/23593099/904178
const formatDateToIso8601 = (date) => {
    const month = `${date.getMonth() + 1}`;
    const day = `${date.getDate()}`;
    const year = date.getFullYear();
    return [
        year,
        month.length < 2 ? '0' + month : month,
        day.length < 2 ? '0' + day : day
    ].join('-');
};

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
