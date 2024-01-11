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
/// <reference types="node" />
import { Stream } from "stream";
import { RestClientFactory } from "../rest/RestClientFactory";
import { Validation } from "./models/Validation";
import { ValidationRequestEntry } from "./models/ValidationRequestEntry";
import { ValidationRequest } from "./models/ValidationRequest";
import { WaitOptions } from "./WaitOptions";
import { CancellationToken } from "../common/CancellationToken";
import { FileValidationRequest } from "./models/FileValidationRequest";
import { ValidationOverviewListingOptions } from "./models/ValidationOverviewListingOptions";
import { ValidationOverview } from "./models/ValidationOverview";
declare type NonFileValidationRequest = string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest;
export declare class EmailValidationsRestClient {
    private readonly _restClientFactory;
    constructor(restClientFactory: RestClientFactory);
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
    submit(request: FileValidationRequest | NonFileValidationRequest, waitOptions?: WaitOptions | null, cancellationToken?: CancellationToken): Promise<Validation | null>;
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
    get(id: string, waitOptions?: WaitOptions | null, cancellationToken?: CancellationToken): Promise<Validation | null>;
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
    delete(id: string, cancellationToken?: CancellationToken): Promise<void>;
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
    list(options?: ValidationOverviewListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<ValidationOverview>;
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
    export(id: string, contentType: string, cancellationToken?: CancellationToken): Promise<Stream>;
}
export {};
//# sourceMappingURL=EmailValidationsRestClient.d.ts.map