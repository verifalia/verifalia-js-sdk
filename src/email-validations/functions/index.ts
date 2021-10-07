import { RestClientFactory } from "../../rest/RestClientFactory";
import { Validation } from "../models/Validation";
import { ValidationRequestEntry } from "../models/ValidationRequestEntry";
import { ValidationRequest } from "../models/ValidationRequest";
import { WaitingStrategy } from "../WaitingStrategy";
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
 * Submits a new email validation for processing. By default, this method does not wait for
 * the completion of the email validation job: pass a `WaitingStrategy` (or `true`, to wait
 * until the job is completed) to request a different waiting behavior.
 * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
 *
 * @param request An object with one or more email addresses to validate. Can be of type string, string[],
 * ValidationRequestEntry, ValidationRequestEntry[], ValidationRequest.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function submitEmailValidation(restClientFactory: RestClientFactory,
    request: string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest,
    waitingStrategy?: WaitingStrategy | boolean,
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

    const response = await restClient.invoke<PartialValidation>(
        'POST',
        '/email-validations',
        undefined,
        data,
        undefined,
        cancellationToken
    );

    /* @if ENVIRONMENT!='production' */
    logger.log('handling submit response', response);
    /* @endif */

    return handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken);
}

/**
 * Submits a new email validation for processing through a file, with support for the following
 * formats:
 * - plain text files (.txt), with one email address per line
 * - comma-separated values (.csv), tab-separated values (.tsv) and other delimiter-separated values files
 * - Microsoft Excel spreadsheets (.xls and .xlsx)
 * 
 * By default, this method does not wait for the completion of the email validation job: pass a
 * waitingStrategy (or `true`, to wait until the job is completed) to request a different waiting behavior.
 * This method can be cancelled through a `CancellationToken`.
 *
 * @param request An object with the file which includes the email addresses to validate and its processing
 * options. Must be of type `FileValidationRequest`.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function submitEmailValidationFile(restClientFactory: RestClientFactory,
    request: FileValidationRequest,
    waitingStrategy?: WaitingStrategy | boolean,
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

    const response = await restClient.invoke<PartialValidation>(
        'POST',
        '/email-validations',
        undefined,
        formData,
        {
            headers
        },
        cancellationToken
    );

    return handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken);
}

async function handleSubmitResponse(restClientFactory: RestClientFactory,
    response: RestResponse<PartialValidation>,
    waitingStrategy?: WaitingStrategy | boolean,
    cancellationToken?: CancellationToken) : Promise<Validation | null> {

    if (typeof waitingStrategy === 'boolean') {
        waitingStrategy = new WaitingStrategy(waitingStrategy);
    }
    
    if (response.status === 200 || response.status === 202) {
        const partialValidation = await response.deserialize();

        // Returns immediately if the validation has been completed or if we should not wait for it

        if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
            return retrieveValidationFromPartialValidation(restClientFactory,
                partialValidation,
                cancellationToken);
        }

        return waitValidationForCompletion(restClientFactory,
            partialValidation.overview,
            waitingStrategy,
            cancellationToken);
    }

    if (response.status === 404 || response.status === 410) {
        return null;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
}

/**
 * Returns an email validation job previously submitted for processing. By default, this method does
 * not wait for the eventual completion of the email validation job: pass a
 * waitingStrategy (or `true`, to wait until the job is completed) to request a different waiting behavior.
 * This method can be cancelled through a `CancellationToken`.
 *
 * @param id The ID of the email validation job to retrieve.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
 * validation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function getEmailValidation(restClientFactory: RestClientFactory,
    id: string,
    waitingStrategy?: WaitingStrategy | boolean,
    cancellationToken?: CancellationToken): Promise<Validation | null> {

    const restClient = restClientFactory.build();
    const response = await restClient.invoke<PartialValidation>(
        'GET',
        `/email-validations/${id}`,
        undefined,
        undefined,
        undefined,
        cancellationToken
    );

    if (response.status === 200 || response.status === 202) {
        const partialValidation = await response.deserialize();

        // Returns immediately if the validation has been completed or if we should not wait for it

        if (typeof waitingStrategy === 'boolean') {
            waitingStrategy = new WaitingStrategy(waitingStrategy);
        }

        if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
            return retrieveValidationFromPartialValidation(restClientFactory,
                partialValidation,
                cancellationToken);
        }

        return waitValidationForCompletion(restClientFactory,
            partialValidation.overview,
            waitingStrategy,
            cancellationToken);
    }

    if (response.status === 404 || response.status === 410) {
        return null;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
}


/**
 * Deletes an email validation job previously submitted for processing.
 *
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function deleteEmailValidation(restClientFactory: RestClientFactory, id: string, cancellationToken?: CancellationToken): Promise<void> {
    const restClient = restClientFactory.build();
    const response = await restClient.invoke<void>(
        'DELETE',
        `/email-validations/${id}`,
        undefined,
        undefined,
        undefined,
        cancellationToken
    );

    if (response.status === 200 || response.status === 410) {
        return;
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
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

    const response = await restClient.invoke<ValidationEntryListSegment>(
        'GET',
        `/email-validations/${validationId}/entries`,
        queryParams,
        undefined,
        undefined,
        cancellationToken
    );

    if (response.status === 200) {
        return await response.deserialize();
    }

    throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
}

async function waitValidationForCompletion(restClientFactory: RestClientFactory, validationOverview: ValidationOverview, waitingStrategy: WaitingStrategy, cancellationToken?: CancellationToken): Promise<Validation | null> {
    if (!validationOverview) throw new Error('validationOverview is null');
    if (!waitingStrategy) throw new Error('waitingStrategy is null');

    let resultOverview = validationOverview;

    do {
        // Fires a progress, since we are not yet completed

        if (waitingStrategy.progress) {
            waitingStrategy.progress(resultOverview);
        }

        // Wait for the next polling schedule

        await waitingStrategy.waitForNextPoll(resultOverview, cancellationToken);

        // Fetch the job from the API

        const result = await getEmailValidation(restClientFactory, validationOverview.id);

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
 * This method can be cancelled through a `CancellationToken`.
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