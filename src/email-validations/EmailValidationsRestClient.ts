/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2021 Cobisi Research
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

import { RestClientFactory } from "../rest/RestClientFactory";
import { Validation } from "./models/Validation";
import { ValidationRequestEntry } from "./models/ValidationRequestEntry";
import { ValidationRequest } from "./models/ValidationRequest";
import { WaitingStrategy } from "./WaitingStrategy";
import { CancellationToken } from "../common/CancellationToken";

import { submitEmailValidation, deleteEmailValidation, getEmailValidation, submitEmailValidationFile, listEmailValidations, exportEmailValidationEntries } from './functions';
import { FileValidationRequest } from "./models/FileValidationRequest";
import { ValidationOverviewListingOptions } from "./models/ValidationOverviewListingOptions";
import { ValidationOverview } from "./models/ValidationOverview";

type NonFileValidationRequest = string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest;

/* @if ENVIRONMENT!='production' */
import { Logger } from "../diagnostics/Logger";
import { Stream } from "stream";
const logger = new Logger('verifalia');
/* @endif */

export class EmailValidationsRestClient {
    private readonly _restClientFactory: RestClientFactory;

    constructor(restClientFactory: RestClientFactory) {
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
     *
     * @param request An object with one or more email addresses to validate. Can be of type `string`, `string[]`,
     * `ValidationRequestEntry`, `ValidationRequestEntry[]`, `ValidationRequest`, `FileValidationRequest`.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the
     * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
     * advanced scenarios and progress tracking.
     */
    public async submit(request: FileValidationRequest | NonFileValidationRequest,
        waitingStrategy?: WaitingStrategy | boolean,
        cancellationToken?: CancellationToken): Promise<Validation | null> {

        /* @if ENVIRONMENT!='production' */
        logger.log('submitting', request, waitingStrategy);
        /* @endif */
            
        // Use the "file" field as a discriminator to detect whether the argument is a FileValidationRequest
        // or not.

        if ((request as FileValidationRequest).file) {
            return submitEmailValidationFile(this._restClientFactory,
                request as FileValidationRequest,
                waitingStrategy,
                cancellationToken);
        }

        return submitEmailValidation(this._restClientFactory,
            request as NonFileValidationRequest,
            waitingStrategy,
            cancellationToken);
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
     *
     * @param id The ID of the email validation job to retrieve.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
     * validation.
     */
    public async get(id: string, waitingStrategy?: WaitingStrategy | boolean, cancellationToken?: CancellationToken): Promise<Validation | null> {
        return getEmailValidation(this._restClientFactory, id, waitingStrategy, cancellationToken);
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
     *
     * @param id The ID of the email validation job to delete.
     */
    public async delete(id: string, cancellationToken?: CancellationToken): Promise<void> {
        return deleteEmailValidation(this._restClientFactory, id, cancellationToken);
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
     *
     * @param options The options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    public list(options?: ValidationOverviewListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<ValidationOverview> {
        return listEmailValidations(this._restClientFactory, options, cancellationToken);
    }

    /**
     * Returns a stream with an export of the specified completed email validation job, with the goal
     * of generating a *human-readable representation* of the results according to the requested output
     * file format. While the output schema (columns / labels / data format) is fairly complete, you
     * should always consider it as subject to change.
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
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
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
    public export(id: string, contentType: string, cancellationToken?: CancellationToken): Promise<Stream> {
        return exportEmailValidationEntries(this._restClientFactory, id, contentType, cancellationToken);
    }
}