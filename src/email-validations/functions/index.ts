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

import { RestClientFactory } from "../../rest/RestClientFactory";
import { Validation } from "../models/Validation";
import { ValidationRequestEntry } from "../models/ValidationRequestEntry";
import { ValidationRequest } from "../models/ValidationRequest";
import { WaitOptions } from "../WaitOptions";
import { ValidationOverview } from "../models/ValidationOverview";
import { ValidationEntryListSegment } from "../models/ValidationEntryListSegment";
import { ValidationOverviewListingSegment as ValidationOverviewListingSegment } from "../models/ValidationOverviewListingSegment";
import { VerifaliaError } from "../../errors/VerifaliaError";
import { ValidationStatus_Completed } from "../constants";
import { ValidationEntry } from "../models/ValidationEntry";
import { ListingCursor } from "../../common/models/ListingCursor";
import { CancellationToken } from "../../common/CancellationToken";
import { FileValidationRequest } from "../models/FileValidationRequest";
import { ValidationOverviewListingOptions } from "../models/ValidationOverviewListingOptions";
import { RestResponse } from "../../rest/RestResponse";
import { Stream } from "stream";

// Node-specific

/* @if TARGET='node' */
import { ReadStream } from "fs";
import FormData from "form-data";
/* @endif */

/* @if ENVIRONMENT!='production' */
import { Logger } from "../../diagnostics/Logger";
const logger = new Logger('verifalia');
/* @endif */

declare type PartialValidation = {
    overview: ValidationOverview;
    entries: ValidationEntryListSegment;
};

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
export async function submitEmailValidation(restClientFactory: RestClientFactory,
    request: string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest,
    waitOptions?: WaitOptions | null,
    cancellationToken?: CancellationToken): Promise<Validation | null> {

    const restClient = restClientFactory.build();
    let data: ValidationRequest;

    if (typeof request === 'string') {
        data = {
            entries: [{
                inputData: request
            }]
        } as ValidationRequest;
    } else if (Array.isArray(request) && (request as []).every((item: any) => typeof item === 'string')) {
        const entries = (request as string[]).map((item) => ({
            inputData: item
        }) as ValidationRequestEntry);

        data = {
            entries
        } as ValidationRequest;
    } else if ((request as any).inputData) {
        // Single ValidationRequestEntry

        data = {
            entries: [request as ValidationRequestEntry]
        }
    } else if (Array.isArray(request) && (request as []).every((item: any) => item.inputData)) {
        // Array of ValidationRequestEntry

        data = {
            entries: request
        } as ValidationRequest;
    } else if ((request as any).entries) {
        // ValidationRequest

        data = request as ValidationRequest;
    } else {
        throw new Error('data type is unsupported.');
    }

    const waitOptionsOrDefault = waitOptions ?? WaitOptions.default;

    const response = await restClient.invoke<PartialValidation>(
        'POST',
        `/email-validations?waitTime=${waitOptionsOrDefault.submissionWaitTime}`,
        undefined,
        data,
        undefined,
        cancellationToken
    );

    /* @if ENVIRONMENT!='production' */
    logger.log('handling submit response', response);
    /* @endif */

    return handleSubmitResponse(restClientFactory, response, waitOptionsOrDefault, cancellationToken);
}

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
export async function submitEmailValidationFile(restClientFactory: RestClientFactory,
    request: FileValidationRequest,
    waitOptions?: WaitOptions | null,
    cancellationToken?: CancellationToken): Promise<Validation | null> {

    const restClient = restClientFactory.build();
    let formData: FormData;
    let headers = {};

    // Fills out the formData instance, for both Node and the browser

    const fillFormData = () => {
        const { file, ...settings } = request;

        formData.append('inputFile',
            file as any,
            {
                contentType: request.contentType,
                filename: (file as File).name ??
                    (file as any /* ReadStream */).filename
                    // Default value - needed in Node, otherwise it won't include the file in the request :/
                    ?? 'file'
            } as any);
        
        formData.append('settings', JSON.stringify(settings));
    };

    if ((typeof Blob !== 'undefined' && request.file instanceof Blob) || (typeof File !== 'undefined' && request.file instanceof File)) {
        // Browser

        formData = new FormData(); // native
        fillFormData();
    }
    /* @if TARGET='node' */
    else if ((typeof ReadStream !== 'undefined' && request.file instanceof ReadStream) || (typeof Buffer !== 'undefined' && request.file instanceof Buffer)) {
        // Node

        formData = new FormData(); // comes from the form-data package
        fillFormData();

        headers = {
            ...formData.getHeaders()
        };
    }
    /* @endif */
    else {
        throw new Error('data type is unsupported.');
    }

    const waitOptionsOrDefault = waitOptions ?? WaitOptions.default;

    const response = await restClient.invoke<PartialValidation>(
        'POST',
        `/email-validations?waitTime=${waitOptionsOrDefault.submissionWaitTime}`,
        undefined,
        formData,
        {
            headers
        },
        cancellationToken
    );

    return handleSubmitResponse(restClientFactory, response, waitOptionsOrDefault, cancellationToken);
}

async function handleSubmitResponse(restClientFactory: RestClientFactory,
    restResponse: RestResponse<PartialValidation>,
    waitOptions: WaitOptions,
    cancellationToken?: CancellationToken) : Promise<Validation | null> {

    if (restResponse.response.status === 200 || restResponse.response.status === 202) {
        const partialValidation = await restResponse.deserialize();

        // Returns immediately if the validation has been completed or if we should not wait for it

        if (waitOptions === WaitOptions.default || partialValidation.overview.status === ValidationStatus_Completed) {
            return retrieveValidationFromPartialValidation(restClientFactory,
                partialValidation,
                cancellationToken);
        }

        return waitValidationForCompletion(restClientFactory,
            partialValidation.overview,
            waitOptions,
            cancellationToken);
    }

    if (restResponse.response.status === 404 || restResponse.response.status === 410) {
        return null;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${restResponse.response.status} ${restResponse.response.statusText}`);
}

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
export async function getEmailValidation(restClientFactory: RestClientFactory,
    id: string,
    waitOptions?: WaitOptions | null,
    cancellationToken?: CancellationToken): Promise<Validation | null> {

    const waitOptionsOrDefault = waitOptions ?? WaitOptions.default;

    const restClient = restClientFactory.build();
    const restResponse = await restClient.invoke<PartialValidation>(
        'GET',
        `/email-validations/${id}?waitTime=${waitOptionsOrDefault.pollWaitTime}`,
        undefined,
        undefined,
        undefined,
        cancellationToken
    );

    if (restResponse.response.status === 200 || restResponse.response.status === 202) {
        const partialValidation = await restResponse.deserialize();

        // Returns immediately if the validation has been completed or if we should not wait for it

        if (waitOptionsOrDefault === WaitOptions.default || partialValidation.overview.status === ValidationStatus_Completed) {
            return retrieveValidationFromPartialValidation(restClientFactory,
                partialValidation,
                cancellationToken);
        }

        return waitValidationForCompletion(restClientFactory,
            partialValidation.overview,
            waitOptionsOrDefault,
            cancellationToken);
    }

    if (restResponse.response.status === 404 || restResponse.response.status === 410) {
        return null;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${restResponse.response.status} ${restResponse.response.statusText}`);
}


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
export async function exportEmailValidationEntries(restClientFactory: RestClientFactory,
    id: string,
    contentType: string,
    cancellationToken?: CancellationToken): Promise<Stream> {

    const restClient = restClientFactory.build();
    const restResponse = await restClient.invoke<PartialValidation>(
        'GET',
        `/email-validations/${id}/entries`,
        undefined,
        undefined,
        {
            headers: {
                'Accept': contentType
            }                    
        },
        cancellationToken
    );

    if (restResponse.response.status === 200) {
        return restResponse.response.body as Stream;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${restResponse.response.status} ${restResponse.response.statusText}`);
}

/**
 * Deletes an email validation job previously submitted for processing.
 *
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function deleteEmailValidation(restClientFactory: RestClientFactory, id: string, cancellationToken?: CancellationToken): Promise<void> {
    const restClient = restClientFactory.build();
    const restResponse = await restClient.invoke<void>(
        'DELETE',
        `/email-validations/${id}`,
        undefined,
        undefined,
        undefined,
        cancellationToken
    );

    if (restResponse.response.status === 200 || restResponse.response.status === 410) {
        return;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${restResponse.response.status} ${restResponse.response.statusText}`);
}


async function retrieveValidationFromPartialValidation(restClientFactory: RestClientFactory, partialValidation: PartialValidation, cancellationToken?: CancellationToken): Promise<Validation> {
    const allEntries: ValidationEntry[] = [];
    let currentSegment = partialValidation.entries;

    while (currentSegment && currentSegment.data) {
        allEntries.push(...currentSegment.data);

        if (!currentSegment.meta.isTruncated) {
            break;
        }

        currentSegment = await listEntriesSegmentedAsync(restClientFactory,
            partialValidation.overview.id,
            { cursor: currentSegment.meta.cursor } as ListingCursor,
            cancellationToken);
    }

    return {
        overview: partialValidation.overview,
        entries: allEntries
    };
}

async function listEntriesSegmentedAsync(restClientFactory: RestClientFactory, validationId: string, cursor: ListingCursor, cancellationToken?: CancellationToken): Promise<ValidationEntryListSegment> {
    if (!validationId) throw new Error('validationId is null');
    if (!cursor) throw new Error('cursor is null');

    // Generate the additional parameters, where needed

    const restClient = restClientFactory.build();

    // Send the request to the Verifalia servers

    const cursorParamName = cursor.isBackward
        ? "cursor:prev"
        : "cursor";

    const queryParams = {
        [cursorParamName]: cursor.cursor
    };

    if (cursor.limit > 0) {
        queryParams["limit"] = cursor.limit.toString();
    }

    const restResponse = await restClient.invoke<ValidationEntryListSegment>(
        'GET',
        `/email-validations/${validationId}/entries`,
        queryParams,
        undefined,
        undefined,
        cancellationToken
    );

    if (restResponse.response.status === 200) {
        return await restResponse.deserialize();
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${restResponse.response.status} ${restResponse.response.statusText}`);
}

async function waitValidationForCompletion(restClientFactory: RestClientFactory,
    validationOverview: ValidationOverview,
    waitOptions: WaitOptions,
    cancellationToken?: CancellationToken): Promise<Validation | null> {
    if (!validationOverview) throw new Error('validationOverview is null or undefined.');
    if (!waitOptions) throw new Error('waitOptions is null or undefined.');

    let resultOverview = validationOverview;

    do {
        // Fires a progress, since we are not yet completed

        if (waitOptions.progress) {
            waitOptions.progress(resultOverview);
        }

        // Wait for the next polling schedule

        await waitOptions.waitForNextPoll(resultOverview, cancellationToken);

        // Fetch the job from the API

        const result = await getEmailValidation(restClientFactory,
                validationOverview.id,
                waitOptions);

        if (!result) {
            // A null result means the validation has been deleted (or is expired) between a poll and the next one

            return null;
        }

        resultOverview = result.overview;

        // Returns immediately if the validation has been completed

        if (resultOverview.status === ValidationStatus_Completed) {
            return result;
        }
    } while (true);
}

/**
 * Lists all the email validation jobs, from the oldest to the newest. Pass a `ValidationOverviewListingOptions`
 * to specify filters and a different sorting.
 * 
 * This function can be cancelled through a `CancellationToken`.
 *
 * @param options A `ValidationOverviewListingOptions` representing the options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function* listEmailValidations(restClientFactory: RestClientFactory,
    options?: ValidationOverviewListingOptions,
    cancellationToken?: CancellationToken): AsyncGenerator<ValidationOverview> {

    const restClient = restClientFactory.build();
    let listSegment: ValidationOverviewListingSegment | null = null;

    do {
        const params: any = {};

        if (options) {
            if (listSegment && listSegment.meta && listSegment.meta.cursor) {
                const cursorParamName = options.isBackward
                    ? "cursor:prev"
                    : "cursor";

                params[cursorParamName] = listSegment.meta.cursor;
            }
            else {
                // Filters

                if (options.createdOn) {
                    for (const fragment of options.createdOn.serialize('createdOn')) {
                        params[fragment.key] = fragment.value;
                    }
                }
            }
        }

        const response = await restClient.invoke<ValidationOverviewListingSegment>(
            'GET',
            `/email-validations`,
            params,
            undefined,
            undefined,
            cancellationToken
        );

        // TODO: Check the response status code

        listSegment = await response.deserialize();

        for (const item of listSegment.data) {
            if (cancellationToken) {
                cancellationToken.throwIfCancellationRequested();
            }

            yield item;
        }
    } while ((listSegment.meta || {}).isTruncated);
}