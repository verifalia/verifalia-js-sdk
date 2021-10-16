// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter, __asyncGenerator, __await, __rest } from 'tslib';
import { ValidationStatus_Completed } from './email-validations/constants.mjs';
import { ReadStream } from 'fs';
import FormData from 'form-data';

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
const timeSpanMatchRegex = /^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/;
/**
 * Defines a strategy used to wait for the completion of an email verification job in Verifalia.
 */
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
                const timespanMatch = timeSpanMatchRegex.exec(validationOverview.progress.estimatedTimeRemaining);
                if (timespanMatch) {
                    // eslint-disable-next-line radix
                    const hours = parseInt(timespanMatch[2]);
                    // eslint-disable-next-line radix
                    const minutes = parseInt(timespanMatch[3]);
                    // eslint-disable-next-line radix
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
                // eslint-disable-next-line prefer-const
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
                entries
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
 *
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
            const { file } = request, settings = __rest(request, ["file"]);
            formData.append('inputFile', file, {
                contentType: request.contentType,
                filename: (_b = (_a = file.name) !== null && _a !== void 0 ? _a : file /* ReadStream */.filename) !== null && _b !== void 0 ? _b : 'file'
            });
            formData.append('settings', JSON.stringify(settings));
        };
        if ((typeof Blob !== 'undefined' && request.file instanceof Blob) || (typeof File !== 'undefined' && request.file instanceof File)) {
            // Browser
            formData = new FormData(); // native
            fillFormData();
        }
        else if ((typeof ReadStream !== 'undefined' && request.file instanceof ReadStream) || (typeof Buffer !== 'undefined' && request.file instanceof Buffer)) {
            // Node
            formData = new FormData(); // comes from the form-data package
            fillFormData();
            headers = Object.assign({}, formData.getHeaders());
        }
        else {
            throw new Error('data type is unsupported.');
        }
        const response = yield restClient.invoke('POST', '/email-validations', undefined, formData, {
            headers
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
            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
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
 *
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
            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
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
 * Returns a stream with an export of the entries for the specified completed email validation job,
 * with the goal of generating a human-readable representation of the results according to the
 * requested output file format. While the output schema (columns / labels / data format) is fairly
 * complete, you should always consider it as subject to change.
 * This method can be cancelled through a `CancellationToken`.
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
function exportEmailValidationEntries(restClientFactory, id, contentType, cancellationToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const restClient = restClientFactory.build();
        const response = yield restClient.invoke('GET', `/email-validations/${id}/entries`, undefined, undefined, {
            headers: {
                'Accept': contentType
            }
        }, cancellationToken);
        if (response.status === 200) {
            return response.response.body;
        }
        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    });
}
/**
 * Deletes an email validation job previously submitted for processing.
 *
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
 *
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

export { OperationCanceledError as O, VerifaliaError as V, WaitingStrategy as W, submitEmailValidationFile as a, deleteEmailValidation as d, exportEmailValidationEntries as e, getEmailValidation as g, listEmailValidations as l, submitEmailValidation as s };
