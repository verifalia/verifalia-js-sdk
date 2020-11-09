// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter, __asyncGenerator, __await } from 'tslib';
import { ValidationStatus_Completed } from './email-validations/constants.js';

/**
 * Base error class for exceptions thrown by the Verifalia SDK for JavaScript.
 */
class VerifaliaError {
    constructor(message) {
        this.toString = () => {
            return this.message || '[Error]';
        };
        this.message = message;
    }
}

/**
 * Thrown whenever an async method is canceled.
 */
class OperationCanceledError extends VerifaliaError {
    /**
     *
     */
    constructor() {
        super('The operation was canceled');
    }
}

class WaitingStrategy {
    constructor(waitForCompletion, progress = null) {
        this.waitForCompletion = waitForCompletion;
        this.progress = progress;
    }
    waitForNextPoll(validationOverview, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            // Throws in the event the user requested to cancel a pending waiting
            if (cancellationToken) {
                cancellationToken.throwIfCancellationRequested();
            }
            // Observe the ETA if we have one, otherwise a delay given the formula: max(0.5, min(30, 2^(log(noOfEntries, 10) - 1)))
            let delay = Math.max(0.5, Math.min(30, Math.pow(2, Math.log10(validationOverview.noOfEntries) - 1)));
            if (validationOverview.progress && validationOverview.progress.estimatedTimeRemaining) {
                const timespanMatch = validationOverview.progress.estimatedTimeRemaining.match(/^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/);
                if (timespanMatch) {
                    const hours = parseInt(timespanMatch[2]);
                    const minutes = parseInt(timespanMatch[3]);
                    const seconds = parseInt(timespanMatch[4]);
                    // Calculate the delay (in seconds)
                    delay = seconds;
                    delay += minutes * 60;
                    delay += hours * 3600;
                    // TODO: Follow the ETA more precisely: as a safenet, we are constraining it to a maximum of 30s for now.
                    delay = Math.max(0.5, Math.min(30, delay));
                }
            }
            return new Promise((resolve, reject) => {
                let timeout;
                // Upon the eventual cancellation of the token, will clear the pending timeout and immediately reject the promise
                // with an OperationCanceledError.
                const onCanceled = () => {
                    clearTimeout(timeout);
                    reject(new OperationCanceledError());
                };
                timeout = setTimeout(() => {
                    if (cancellationToken) {
                        cancellationToken.unregister(onCanceled);
                    }
                    resolve();
                }, delay * 1000);
                if (cancellationToken) {
                    cancellationToken.register(onCanceled);
                }
            });
        });
    }
}

/**
 * Submits a new email validation for processing. By default, this method does not wait for
 * the completion of the email validation job: pass a `WaitingStrategy` (or `true`, to wait
 * until the job is completed) to request a different waiting behavior.
 * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
 * @param request An object with one or more email addresses to validate. Can be of type string, string[],
 * ValidationRequestEntry, ValidationRequestEntry[], ValidationRequest.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function submitEmailValidation(restClientFactory, request, waitingStrategy, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = restClientFactory.build();
        let data;
        if (typeof request === 'string') {
            data = {
                entries: [{
                        inputData: request
                    }]
            };
        }
        else if (Array.isArray(request) && request.every((item) => typeof item === 'string')) {
            const entries = request.map((item) => ({
                inputData: item
            }));
            data = {
                entries: entries
            };
        }
        else if (request.inputData) {
            // Single ValidationRequestEntry
            data = {
                entries: [request]
            };
        }
        else if (Array.isArray(request) && request.every((item) => item.inputData)) {
            // Array of ValidationRequestEntry
            data = {
                entries: request
            };
        }
        else if (request.entries) {
            // ValidationRequest
            data = request;
        }
        else {
            throw new Error('data type is unsupported.');
        }
        const response = yield restClient.invoke('POST', '/email-validations', undefined, data, undefined, cancellationToken);
        return handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken);
    });
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
 * @param request An object with the file which includes the email addresses to validate and its processing
 * options. Must be of type `FileValidationRequest`.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function submitEmailValidationFile(restClientFactory, request, waitingStrategy, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = restClientFactory.build();
        let formData;
        let headers = {};
        // Fills out the formData instance, for both Node and the browser
        const fillFormData = () => {
            var _a, _b;
            formData.append('inputFile', request.file, {
                contentType: request.contentType,
                filename: (_b = (_a = request.file.name) !== null && _a !== void 0 ? _a : request.file /*ReadStream*/.filename) !== null && _b !== void 0 ? _b : 'file'
            });
            formData.append('settings', JSON.stringify({
                name: request.name,
                quality: request.quality,
                deduplication: request.deduplication,
                priority: request.priority,
                retention: request.retention,
                // File-specific
                startingRow: request.startingRow,
                endingRow: request.endingRow,
                column: request.column,
                sheet: request.sheet,
                lineEnding: request.lineEnding,
                delimiter: request.delimiter,
            }));
        };
        if ((typeof Blob !== 'undefined' && request.file instanceof Blob) || (typeof File !== 'undefined' && request.file instanceof File)) {
            // Browser
            formData = new FormData(); // native
            fillFormData();
        }
        else {
            throw new Error('data type is unsupported.');
        }
        const response = yield restClient.invoke('POST', '/email-validations', undefined, formData, {
            headers: headers
        }, cancellationToken);
        return handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken);
    });
}
function handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof waitingStrategy === 'boolean') {
            waitingStrategy = new WaitingStrategy(waitingStrategy);
        }
        if (response.status === 200 || response.status === 202) {
            const partialValidation = yield response.deserialize();
            // Returns immediately if the validation has been completed or if we should not wait for it
            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status == ValidationStatus_Completed) {
                return retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken);
            }
            return waitValidationForCompletion(restClientFactory, partialValidation.overview, waitingStrategy, cancellationToken);
        }
        if (response.status === 404 || response.status === 410) {
            return null;
        }
        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    });
}
/**
 * Returns an email validation job previously submitted for processing. By default, this method does
 * not wait for the eventual completion of the email validation job: pass a
 * waitingStrategy (or `true`, to wait until the job is completed) to request a different waiting behavior.
 * This method can be cancelled through a `CancellationToken`.
 * @param id The ID of the email validation job to retrieve.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
 * validation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function getEmailValidation(restClientFactory, id, waitingStrategy, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = restClientFactory.build();
        const response = yield restClient.invoke('GET', `/email-validations/${id}`, undefined, undefined, undefined, cancellationToken);
        if (response.status === 200 || response.status === 202) {
            const partialValidation = yield response.deserialize();
            // Returns immediately if the validation has been completed or if we should not wait for it
            if (typeof waitingStrategy === 'boolean') {
                waitingStrategy = new WaitingStrategy(waitingStrategy);
            }
            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status == ValidationStatus_Completed) {
                return retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken);
            }
            return waitValidationForCompletion(restClientFactory, partialValidation.overview, waitingStrategy, cancellationToken);
        }
        if (response.status === 404 || response.status === 410) {
            return null;
        }
        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    });
}
/**
 * Deletes an email validation job previously submitted for processing.
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function deleteEmailValidation(restClientFactory, id, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = restClientFactory.build();
        const response = yield restClient.invoke('DELETE', `/email-validations/${id}`, undefined, undefined, undefined, cancellationToken);
        if (response.status === 200 || response.status === 410) {
            return;
        }
        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    });
}
function retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const allEntries = [];
        let currentSegment = partialValidation.entries;
        while (currentSegment && currentSegment.data) {
            allEntries.push(...currentSegment.data);
            if (!currentSegment.meta.isTruncated) {
                break;
            }
            currentSegment = yield listEntriesSegmentedAsync(restClientFactory, partialValidation.overview.id, { cursor: currentSegment.meta.cursor }, cancellationToken);
        }
        return {
            overview: partialValidation.overview,
            entries: allEntries
        };
    });
}
function listEntriesSegmentedAsync(restClientFactory, validationId, cursor, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validationId)
            throw new Error('validationId is null');
        if (!cursor)
            throw new Error('cursor is null');
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
        const response = yield restClient.invoke('GET', `/email-validations/${validationId}/entries`, queryParams, undefined, undefined, cancellationToken);
        if (response.status === 200) {
            return yield response.deserialize();
        }
        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    });
}
function waitValidationForCompletion(restClientFactory, validationOverview, waitingStrategy, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validationOverview)
            throw new Error('validationOverview is null');
        if (!waitingStrategy)
            throw new Error('waitingStrategy is null');
        let resultOverview = validationOverview;
        do {
            // Fires a progress, since we are not yet completed
            if (waitingStrategy.progress) {
                waitingStrategy.progress(resultOverview);
            }
            // Wait for the next polling schedule
            yield waitingStrategy.waitForNextPoll(resultOverview, cancellationToken);
            // Fetch the job from the API
            const result = yield getEmailValidation(restClientFactory, validationOverview.id);
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
    });
}
/**
 * Lists all the email validation jobs, from the oldest to the newest. Pass a `ValidationOverviewListingOptions`
 * to specify filters and a different sorting.
 * This method can be cancelled through a `CancellationToken`.
 * @param options A `ValidationOverviewListingOptions` representing the options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function listEmailValidations(restClientFactory, options, cancellationToken) {
    return __asyncGenerator(this, arguments, function* listEmailValidations_1() {
        const restClient = restClientFactory.build();
        let listSegment = null;
        do {
            const params = {};
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
            const response = yield __await(restClient.invoke('GET', `/email-validations`, params, undefined, undefined, cancellationToken));
            // TODO: Check the response status code
            listSegment = yield __await(response.deserialize());
            for (const item of listSegment.data) {
                if (cancellationToken) {
                    cancellationToken.throwIfCancellationRequested();
                }
                yield yield __await(item);
            }
        } while ((listSegment.meta || {}).isTruncated);
    });
}

export { OperationCanceledError as O, VerifaliaError as V, WaitingStrategy as W, submitEmailValidationFile as a, deleteEmailValidation as d, getEmailValidation as g, listEmailValidations as l, submitEmailValidation as s };
