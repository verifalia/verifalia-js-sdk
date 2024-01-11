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
import { RestClientFactory } from "../../rest/RestClientFactory";
import { Validation } from "../models/Validation";
import { ValidationRequestEntry } from "../models/ValidationRequestEntry";
import { ValidationRequest } from "../models/ValidationRequest";
import { WaitOptions } from "../WaitOptions";
import { ValidationOverview } from "../models/ValidationOverview";
import { CancellationToken } from "../../common/CancellationToken";
import { FileValidationRequest } from "../models/FileValidationRequest";
import { ValidationOverviewListingOptions } from "../models/ValidationOverviewListingOptions";
import { Stream } from "stream";
/**
 * Submits a new email validation for processing.
 *
 * By default, this function waits for the completion of the email validation job: pass a `WaitOptions`
 * to request a different waiting behavior.
 * This function returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
 *
 * @param request An object with one or more email addresses to validate. Can be of type string, string[],
 * ValidationRequestEntry, ValidationRequestEntry[], ValidationRequest.
 * @param waitOptions Optional configuration settings for waiting on the completion of an email validation job.
 * Can be `undefined` (or `null`) to wait for the completion using the default settings, `WaitOptions.noWait` to
 * avoid waiting or an instance of `WaitOptions` for advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function submitEmailValidation(restClientFactory: RestClientFactory, request: string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest, waitOptions?: WaitOptions | null, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Submits a new email validation for processing through a file, with support for the following
 * formats:
 * - plain text files (.txt), with one email address per line
 * - comma-separated values (.csv), tab-separated values (.tsv) and other delimiter-separated values files
 * - Microsoft Excel spreadsheets (.xls and .xlsx)
 *
 * By default, this function waits for the completion of the email validation job: pass a `WaitOptions`
 * to request a different waiting behavior.
 * This function can be cancelled through a `CancellationToken`.
 *
 * @param request An object with the file which includes the email addresses to validate and its processing
 * options. Must be of type `FileValidationRequest`.
 * @param waitOptions Optional configuration settings for waiting on the completion of an email validation job.
 * Can be `undefined` (or `null`) to wait for the completion using the default settings, `WaitOptions.noWait` to
 * avoid waiting or an instance of `WaitOptions` for advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function submitEmailValidationFile(restClientFactory: RestClientFactory, request: FileValidationRequest, waitOptions?: WaitOptions | null, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Returns an email validation job previously submitted for processing.
 *
 * By default, this function waits for the completion of the email validation job: pass a `WaitOptions`
 * to request a different waiting behavior.
 * This function can be cancelled through a `CancellationToken`.
 *
 * @param id The ID of the email validation job to retrieve.
 * @param waitOptions Optional configuration settings for waiting on the completion of an email validation job.
 * Can be `undefined` (or `null`) to wait for the completion using the default settings, `WaitOptions.noWait` to
 * avoid waiting or an instance of `WaitOptions` for advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function getEmailValidation(restClientFactory: RestClientFactory, id: string, waitOptions?: WaitOptions | null, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Returns a stream with an export of the entries for the specified completed email validation job,
 * with the goal of generating a human-readable representation of the results according to the
 * requested output file format. While the output schema (columns / labels / data format) is fairly
 * complete, you should always consider it as subject to change.
 *
 * This function can be cancelled through a `CancellationToken`.
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
export declare function exportEmailValidationEntries(restClientFactory: RestClientFactory, id: string, contentType: string, cancellationToken?: CancellationToken): Promise<Stream>;
/**
 * Deletes an email validation job previously submitted for processing.
 *
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function deleteEmailValidation(restClientFactory: RestClientFactory, id: string, cancellationToken?: CancellationToken): Promise<void>;
/**
 * Lists all the email validation jobs, from the oldest to the newest. Pass a `ValidationOverviewListingOptions`
 * to specify filters and a different sorting.
 *
 * This function can be cancelled through a `CancellationToken`.
 *
 * @param options A `ValidationOverviewListingOptions` representing the options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function listEmailValidations(restClientFactory: RestClientFactory, options?: ValidationOverviewListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<ValidationOverview>;
//# sourceMappingURL=index.d.ts.map