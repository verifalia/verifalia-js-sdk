// (c) Verifalia - email verification service - https://verifalia.com
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var tslib = require('tslib');
var fs = require('fs');
var FormData = _interopDefault(require('form-data'));
var Stream = _interopDefault(require('stream'));
var http = _interopDefault(require('http'));
var Url = _interopDefault(require('url'));
var https = require('https');
var https__default = _interopDefault(https);
var zlib = _interopDefault(require('zlib'));

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
var VerifaliaError = /** @class */ (function () {
    function VerifaliaError(message) {
        var _this = this;
        this.toString = function () {
            return _this.message || '[Error]';
        };
        this.message = message;
    }
    return VerifaliaError;
}());

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
var OperationCanceledError = /** @class */ (function (_super) {
    tslib.__extends(OperationCanceledError, _super);
    /**
     *
     */
    function OperationCanceledError() {
        return _super.call(this, 'The operation was canceled') || this;
    }
    return OperationCanceledError;
}(VerifaliaError));

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
var timeSpanMatchRegex = /^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/;
/**
 * Defines a strategy used to wait for the completion of an email verification job in Verifalia.
 */
var WaitingStrategy = /** @class */ (function () {
    function WaitingStrategy(waitForCompletion, progress) {
        if (progress === void 0) { progress = null; }
        this.waitForCompletion = waitForCompletion;
        this.progress = progress;
    }
    WaitingStrategy.prototype.waitForNextPoll = function (validationOverview, cancellationToken) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var delay, timespanMatch, hours, minutes, seconds;
            return tslib.__generator(this, function (_a) {
                // Throws in the event the user requested to cancel a pending waiting
                if (cancellationToken) {
                    cancellationToken.throwIfCancellationRequested();
                }
                delay = Math.max(0.5, Math.min(30, Math.pow(2, Math.log10(validationOverview.noOfEntries) - 1)));
                if (validationOverview.progress && validationOverview.progress.estimatedTimeRemaining) {
                    timespanMatch = timeSpanMatchRegex.exec(validationOverview.progress.estimatedTimeRemaining);
                    if (timespanMatch) {
                        hours = parseInt(timespanMatch[2]);
                        minutes = parseInt(timespanMatch[3]);
                        seconds = parseInt(timespanMatch[4]);
                        // Calculate the delay (in seconds)
                        delay = seconds;
                        delay += minutes * 60;
                        delay += hours * 3600;
                        // TODO: Follow the ETA more precisely: as a safenet, we are constraining it to a maximum of 30s for now.
                        delay = Math.max(0.5, Math.min(30, delay));
                    }
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // eslint-disable-next-line prefer-const
                        var timeout;
                        // Upon the eventual cancellation of the token, will clear the pending timeout and immediately reject the promise
                        // with an OperationCanceledError.
                        var onCanceled = function () {
                            clearTimeout(timeout);
                            reject(new OperationCanceledError());
                        };
                        timeout = setTimeout(function () {
                            if (cancellationToken) {
                                cancellationToken.unregister(onCanceled);
                            }
                            resolve();
                        }, delay * 1000);
                        if (cancellationToken) {
                            cancellationToken.register(onCanceled);
                        }
                    })];
            });
        });
    };
    return WaitingStrategy;
}());

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
 * The email validation job is being processed by Verifalia. The completion progress, if any, is available
 * through the progress property
 */
var ValidationStatus_InProgress = 'InProgress';
/**
 * The email validation job has been completed and its results are available.
 */
var ValidationStatus_Completed = 'Completed';
/**
 * The email validation job has either been deleted.
 */
var ValidationStatus_Deleted = 'Deleted';
/**
 * The email validation job is expired.
 */
var ValidationStatus_Expired = 'Expired';
/**
 * Duplicates detection is turned off.
 */
var DeduplicationMode_Off = 'Off';
/**
 * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
 * false duplicates.
 */
var DeduplicationMode_Safe = 'Safe';
/**
 * Identifies duplicates using a set of relaxed rules which assume the target email
 * service providers are configured with modern settings only (instead of the broader
 * options the RFCs from the '80s allow).
 */
var DeduplicationMode_Relaxed = 'Relaxed';
/**
 * The Standard quality level. Suitable for most businesses, provides good results for the
 * vast majority of email addresses; features a single validation pass and 5 second anti-tarpit
 * time; less suitable for validating email addresses with temporary issues (mailbox over
 * quota, greylisting, etc.) and slower mail exchangers.
 */
var QualityLevelName_Standard = 'Standard';
/**
 * The High quality level. Much higher quality, featuring 3 validation passes and 50 seconds
 * of anti-tarpit time, so you can even validate most addresses with temporary issues, or
 * slower mail exchangers.
 */
var QualityLevelName_High = 'High';
/**
 * The Extreme quality level. Unbeatable, top-notch quality for professionals who need the best
 * results the industry can offer: performs email validations at the highest level, with 9
 * validation passes and 2 minutes of anti-tarpit time.
 */
var QualityLevelName_Extreme = 'Extreme';
/**
 * A validation entry marked as Deliverable refers to an email address which is deliverable.
 */
var ValidationEntryClassification_Deliverable = 'Deliverable';
/**
 * A validation entry marked as Risky refers to an email address which could be no longer valid.
 */
var ValidationEntryClassification_Risky = 'Risky';
/**
 * A validation entry marked as Undeliverable refers to an email address which is either invalid or
 * no longer deliverable.
 */
var ValidationEntryClassification_Undeliverable = 'Undeliverable';
/**
 * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
 */
var ValidationEntryClassification_Unknown = 'Unknown';
/**
 * The email address has been successfully validated.
 */
var ValidationEntryStatus_Success = 'Success';
/**
 * A quoted pair within a quoted word is not closed properly.
 */
var ValidationEntryStatus_UnmatchedQuotedPair = 'UnmatchedQuotedPair';
/**
 * An unexpected quoted pair sequence has been found within a quoted word.
 */
var ValidationEntryStatus_UnexpectedQuotedPairSequence = 'UnexpectedQuotedPairSequence';
/** A new word boundary start has been detected at an invalid position.
*/
var ValidationEntryStatus_InvalidWordBoundaryStart = 'InvalidWordBoundaryStart';
/** An invalid character has been detected in the provided sequence.
*/
var ValidationEntryStatus_InvalidCharacterInSequence = 'InvalidCharacterInSequence';
/** The number of parenthesis used to open comments is not equal to the one used to close them.
*/
var ValidationEntryStatus_UnbalancedCommentParenthesis = 'UnbalancedCommentParenthesis';
/** An invalid sequence of two adjacent dots has been found.
*/
var ValidationEntryStatus_DoubleDotSequence = 'DoubleDotSequence';
/** The local part of the e-mail address has an invalid length.
*/
var ValidationEntryStatus_InvalidLocalPartLength = 'InvalidLocalPartLength';
/** An invalid folding white space (FWS) sequence has been found.
*/
var ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence = 'InvalidFoldingWhiteSpaceSequence';
/** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
*/
var ValidationEntryStatus_AtSignNotFound = 'AtSignNotFound';
/** An invalid quoted word with no content has been found.
*/
var ValidationEntryStatus_InvalidEmptyQuotedWord = 'InvalidEmptyQuotedWord';
/** The email address has an invalid total length.
*/
var ValidationEntryStatus_InvalidAddressLength = 'InvalidAddressLength';
/** The domain part of the email address is not compliant with the IETF standards.
*/
var ValidationEntryStatus_DomainPartCompliancyFailure = 'DomainPartCompliancyFailure';
/** The email address is not compliant with the additional syntax rules of the email service provider
* which should eventually manage it.
*/
var ValidationEntryStatus_IspSpecificSyntaxFailure = 'IspSpecificSyntaxFailure';
/** The local part of the email address is a well-known role account. */
var ValidationEntryStatus_LocalPartIsWellKnownRoleAccount = 'LocalPartIsWellKnownRoleAccount;';
/** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
var ValidationEntryStatus_DnsQueryTimeout = 'DnsQueryTimeout';
/** Verification failed because of a socket connection error occured while querying the DNS server.
*/
var ValidationEntryStatus_DnsConnectionFailure = 'DnsConnectionFailure';
/** The domain of the email address does not exist.
*/
var ValidationEntryStatus_DomainDoesNotExist = 'DomainDoesNotExist';
/** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
* host on the Internet.
*/
var ValidationEntryStatus_DomainIsMisconfigured = 'DomainIsMisconfigured';
/** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
 */
var ValidationEntryStatus_DomainHasNullMx = 'DomainHasNullMx';
/** The email address is provided by a well-known disposable email address provider (DEA).
*/
var ValidationEntryStatus_DomainIsWellKnownDea = 'DomainIsWellKnownDea';
/** The mail exchanger being tested is a well-known disposable email address provider (DEA).
*/
var ValidationEntryStatus_MailExchangerIsWellKnownDea = 'MailExchangerIsWellKnownDea';
/** While both the domain and the mail exchanger for the email address being tested are not from a well-known
* disposable email address provider (DEA); the mailbox is actually disposable.
*/
var ValidationEntryStatus_MailboxIsDea = 'MailboxIsDea';
/** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
*/
var ValidationEntryStatus_SmtpConnectionTimeout = 'SmtpConnectionTimeout';
/** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
*/
var ValidationEntryStatus_SmtpConnectionFailure = 'SmtpConnectionFailure';
/** The mailbox for the e-mail address does not exist.
*/
var ValidationEntryStatus_MailboxDoesNotExist = 'MailboxDoesNotExist';
/** A connection error occurred while validating the mailbox for the e-mail address.
*/
var ValidationEntryStatus_MailboxConnectionFailure = 'MailboxConnectionFailure';
/** The external mail exchanger rejected the validation request.
*/
var ValidationEntryStatus_LocalSenderAddressRejected = 'LocalSenderAddressRejected';
/** A timeout occured while verifying the existence of the mailbox.
*/
var ValidationEntryStatus_MailboxValidationTimeout = 'MailboxValidationTimeout';
/** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
* (could be over quota; for example).
*/
var ValidationEntryStatus_MailboxTemporarilyUnavailable = 'MailboxTemporarilyUnavailable';
/** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
 * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
 * protocol extensions.
*/
var ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes = 'ServerDoesNotSupportInternationalMailboxes';
/** A timeout occured while verifying fake e-mail address rejection for the mail server.
*/
var ValidationEntryStatus_CatchAllValidationTimeout = 'CatchAllValidationTimeout';
/** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
*/
var ValidationEntryStatus_ServerIsCatchAll = 'ServerIsCatchAll';
/** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
*/
var ValidationEntryStatus_CatchAllConnectionFailure = 'CatchAllConnectionFailure';
/** The mail exchanger responsible for the email address under test is temporarily unavailable.
*/
var ValidationEntryStatus_ServerTemporaryUnavailable = 'ServerTemporaryUnavailable';
/** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
* caused the SMTP session to be aborted.
*/
var ValidationEntryStatus_SmtpDialogError = 'SmtpDialogError';
/** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
* of its own policy rules.
*/
var ValidationEntryStatus_LocalEndPointRejected = 'LocalEndPointRejected';
/** One or more unhandled exceptions have been thrown during the verification process and something went wrong
* on the Verifalia side.
*/
var ValidationEntryStatus_UnhandledException = 'UnhandledException';
/** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
*/
var ValidationEntryStatus_MailExchangerIsHoneypot = 'MailExchangerIsHoneypot';
/** The domain literal of the email address couldn't accept messages from the Internet. */
var ValidationEntryStatus_UnacceptableDomainLiteral = 'UnacceptableDomainLiteral';
/**
 * The item is a duplicate of another email address in the list.
 * To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
 * instance which exposes this status code</remarks>
 */
var ValidationEntryStatus_Duplicate = 'Duplicate';
/**
 * The lowest possible processing priority (speed) for a validation job.
 */
var ValidationPriority_Lowest = 0;
/**
 * Normal processing priority (speed) for a validation job.
 */
var ValidationPriority_Normal = 127;
/**
 * The highest possible relative processing priority (speed) for a validation job.
 */
var ValidationPriority_Highest = 255;

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
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, data, entries, response;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    restClient = restClientFactory.build();
                    if (typeof request === 'string') {
                        data = {
                            entries: [{
                                    inputData: request
                                }]
                        };
                    }
                    else if (Array.isArray(request) && request.every(function (item) { return typeof item === 'string'; })) {
                        entries = request.map(function (item) { return ({
                            inputData: item
                        }); });
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
                    else if (Array.isArray(request) && request.every(function (item) { return item.inputData; })) {
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
                    return [4 /*yield*/, restClient.invoke('POST', '/email-validations', undefined, data, undefined, cancellationToken)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken)];
            }
        });
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
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, formData, headers, fillFormData, response;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    restClient = restClientFactory.build();
                    headers = {};
                    fillFormData = function () {
                        var _a, _b;
                        var file = request.file, settings = tslib.__rest(request, ["file"]);
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
                    else if ((typeof fs.ReadStream !== 'undefined' && request.file instanceof fs.ReadStream) || (typeof Buffer !== 'undefined' && request.file instanceof Buffer)) {
                        // Node
                        formData = new FormData(); // comes from the form-data package
                        fillFormData();
                        headers = tslib.__assign({}, formData.getHeaders());
                    }
                    else {
                        throw new Error('data type is unsupported.');
                    }
                    return [4 /*yield*/, restClient.invoke('POST', '/email-validations', undefined, formData, {
                            headers: headers
                        }, cancellationToken)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken)];
            }
        });
    });
}
function handleSubmitResponse(restClientFactory, response, waitingStrategy, cancellationToken) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var partialValidation;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (typeof waitingStrategy === 'boolean') {
                        waitingStrategy = new WaitingStrategy(waitingStrategy);
                    }
                    if (!(response.status === 200 || response.status === 202)) return [3 /*break*/, 2];
                    return [4 /*yield*/, response.deserialize()];
                case 1:
                    partialValidation = _a.sent();
                    // Returns immediately if the validation has been completed or if we should not wait for it
                    if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
                        return [2 /*return*/, retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken)];
                    }
                    return [2 /*return*/, waitValidationForCompletion(restClientFactory, partialValidation.overview, waitingStrategy, cancellationToken)];
                case 2:
                    if (response.status === 404 || response.status === 410) {
                        return [2 /*return*/, null];
                    }
                    throw new VerifaliaError("Unexpected HTTP response: " + response.status + " " + response.statusText);
            }
        });
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
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, response, partialValidation;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    restClient = restClientFactory.build();
                    return [4 /*yield*/, restClient.invoke('GET', "/email-validations/" + id, undefined, undefined, undefined, cancellationToken)];
                case 1:
                    response = _a.sent();
                    if (!(response.status === 200 || response.status === 202)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.deserialize()];
                case 2:
                    partialValidation = _a.sent();
                    // Returns immediately if the validation has been completed or if we should not wait for it
                    if (typeof waitingStrategy === 'boolean') {
                        waitingStrategy = new WaitingStrategy(waitingStrategy);
                    }
                    if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status === ValidationStatus_Completed) {
                        return [2 /*return*/, retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken)];
                    }
                    return [2 /*return*/, waitValidationForCompletion(restClientFactory, partialValidation.overview, waitingStrategy, cancellationToken)];
                case 3:
                    if (response.status === 404 || response.status === 410) {
                        return [2 /*return*/, null];
                    }
                    throw new VerifaliaError("Unexpected HTTP response: " + response.status + " " + response.statusText);
            }
        });
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
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, response;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    restClient = restClientFactory.build();
                    return [4 /*yield*/, restClient.invoke('GET', "/email-validations/" + id + "/entries", undefined, undefined, {
                            headers: {
                                'Accept': contentType
                            }
                        }, cancellationToken)];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        return [2 /*return*/, response.response.body];
                    }
                    throw new VerifaliaError("Unexpected HTTP response: " + response.status + " " + response.statusText);
            }
        });
    });
}
/**
 * Deletes an email validation job previously submitted for processing.
 *
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function deleteEmailValidation(restClientFactory, id, cancellationToken) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, response;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    restClient = restClientFactory.build();
                    return [4 /*yield*/, restClient.invoke('DELETE', "/email-validations/" + id, undefined, undefined, undefined, cancellationToken)];
                case 1:
                    response = _a.sent();
                    if (response.status === 200 || response.status === 410) {
                        return [2 /*return*/];
                    }
                    throw new VerifaliaError("Unexpected HTTP response: " + response.status + " " + response.statusText);
            }
        });
    });
}
function retrieveValidationFromPartialValidation(restClientFactory, partialValidation, cancellationToken) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var allEntries, currentSegment;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allEntries = [];
                    currentSegment = partialValidation.entries;
                    _a.label = 1;
                case 1:
                    if (!(currentSegment && currentSegment.data)) return [3 /*break*/, 3];
                    allEntries.push.apply(allEntries, currentSegment.data);
                    if (!currentSegment.meta.isTruncated) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, listEntriesSegmentedAsync(restClientFactory, partialValidation.overview.id, { cursor: currentSegment.meta.cursor }, cancellationToken)];
                case 2:
                    currentSegment = _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, {
                        overview: partialValidation.overview,
                        entries: allEntries
                    }];
            }
        });
    });
}
function listEntriesSegmentedAsync(restClientFactory, validationId, cursor, cancellationToken) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var restClient, cursorParamName, queryParams, response;
        var _a;
        return tslib.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!validationId)
                        throw new Error('validationId is null');
                    if (!cursor)
                        throw new Error('cursor is null');
                    restClient = restClientFactory.build();
                    cursorParamName = cursor.isBackward
                        ? "cursor:prev"
                        : "cursor";
                    queryParams = (_a = {},
                        _a[cursorParamName] = cursor.cursor,
                        _a);
                    if (cursor.limit > 0) {
                        queryParams["limit"] = cursor.limit.toString();
                    }
                    return [4 /*yield*/, restClient.invoke('GET', "/email-validations/" + validationId + "/entries", queryParams, undefined, undefined, cancellationToken)];
                case 1:
                    response = _b.sent();
                    if (!(response.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.deserialize()];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: throw new VerifaliaError("Unexpected HTTP response: " + response.status + " " + response.statusText);
            }
        });
    });
}
function waitValidationForCompletion(restClientFactory, validationOverview, waitingStrategy, cancellationToken) {
    return tslib.__awaiter(this, void 0, void 0, function () {
        var resultOverview, result;
        return tslib.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!validationOverview)
                        throw new Error('validationOverview is null');
                    if (!waitingStrategy)
                        throw new Error('waitingStrategy is null');
                    resultOverview = validationOverview;
                    _a.label = 1;
                case 1:
                    // Fires a progress, since we are not yet completed
                    if (waitingStrategy.progress) {
                        waitingStrategy.progress(resultOverview);
                    }
                    // Wait for the next polling schedule
                    return [4 /*yield*/, waitingStrategy.waitForNextPoll(resultOverview, cancellationToken)];
                case 2:
                    // Wait for the next polling schedule
                    _a.sent();
                    return [4 /*yield*/, getEmailValidation(restClientFactory, validationOverview.id)];
                case 3:
                    result = _a.sent();
                    if (!result) {
                        // A null result means the validation has been deleted (or is expired) between a poll and the next one
                        return [2 /*return*/, null];
                    }
                    resultOverview = result.overview;
                    // Returns immediately if the validation has been completed
                    if (resultOverview.status === ValidationStatus_Completed) {
                        return [2 /*return*/, result];
                    }
                    _a.label = 4;
                case 4:
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
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
    return tslib.__asyncGenerator(this, arguments, function listEmailValidations_1() {
        var restClient, listSegment, params, cursorParamName, _i, _a, fragment, response, _b, _c, item;
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    restClient = restClientFactory.build();
                    listSegment = null;
                    _d.label = 1;
                case 1:
                    params = {};
                    if (options) {
                        if (listSegment && listSegment.meta && listSegment.meta.cursor) {
                            cursorParamName = options.isBackward
                                ? "cursor:prev"
                                : "cursor";
                            params[cursorParamName] = listSegment.meta.cursor;
                        }
                        else {
                            // Filters
                            if (options.createdOn) {
                                for (_i = 0, _a = options.createdOn.serialize('createdOn'); _i < _a.length; _i++) {
                                    fragment = _a[_i];
                                    params[fragment.key] = fragment.value;
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, tslib.__await(restClient.invoke('GET', "/email-validations", params, undefined, undefined, cancellationToken))];
                case 2:
                    response = _d.sent();
                    return [4 /*yield*/, tslib.__await(response.deserialize())];
                case 3:
                    // TODO: Check the response status code
                    listSegment = _d.sent();
                    _b = 0, _c = listSegment.data;
                    _d.label = 4;
                case 4:
                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                    item = _c[_b];
                    if (cancellationToken) {
                        cancellationToken.throwIfCancellationRequested();
                    }
                    return [4 /*yield*/, tslib.__await(item)];
                case 5: return [4 /*yield*/, _d.sent()];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 4];
                case 8:
                    if ((listSegment.meta || {}).isTruncated) return [3 /*break*/, 1];
                    _d.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
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
var EmailValidationsRestClient = /** @class */ (function () {
    function EmailValidationsRestClient(restClientFactory) {
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
    EmailValidationsRestClient.prototype.submit = function (request, waitingStrategy, cancellationToken) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                // Use the "file" field as a discriminator to detect whether the argument is a FileValidationRequest
                // or not.
                if (request.file) {
                    return [2 /*return*/, submitEmailValidationFile(this._restClientFactory, request, waitingStrategy, cancellationToken)];
                }
                return [2 /*return*/, submitEmailValidation(this._restClientFactory, request, waitingStrategy, cancellationToken)];
            });
        });
    };
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
    EmailValidationsRestClient.prototype.get = function (id, waitingStrategy, cancellationToken) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, getEmailValidation(this._restClientFactory, id, waitingStrategy, cancellationToken)];
            });
        });
    };
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
    EmailValidationsRestClient.prototype.delete = function (id, cancellationToken) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            return tslib.__generator(this, function (_a) {
                return [2 /*return*/, deleteEmailValidation(this._restClientFactory, id, cancellationToken)];
            });
        });
    };
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
    EmailValidationsRestClient.prototype.list = function (options, cancellationToken) {
        return listEmailValidations(this._restClientFactory, options, cancellationToken);
    };
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
    EmailValidationsRestClient.prototype.export = function (id, contentType, cancellationToken) {
        return exportEmailValidationEntries(this._restClientFactory, id, contentType, cancellationToken);
    };
    return EmailValidationsRestClient;
}());

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
 * Returns the current credits balance for the Verifalia account.
 * To add credit packs to your Verifalia account visit https://verifalia.com/client-area#/credits/add
 *
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
var getCreditsBalance = function (restClientFactory, cancellationToken) { return tslib.__awaiter(void 0, void 0, void 0, function () {
    var restClient;
    return tslib.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                restClient = restClientFactory.build();
                return [4 /*yield*/, restClient.invoke("GET", '/credits/balance', undefined, undefined, undefined, cancellationToken)];
            case 1: return [4 /*yield*/, (_a.sent()).deserialize()];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
/**
 * Lists the daily usages of the credits for the Verifalia account.
 *
 * @param options The options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function listCreditsDailyUsages(restClientFactory, options, cancellationToken) {
    return tslib.__asyncGenerator(this, arguments, function listCreditsDailyUsages_1() {
        var restClient, listSegment, params, cursorParamName, _i, _a, fragment, response, _b, _c, item;
        return tslib.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    restClient = restClientFactory.build();
                    listSegment = null;
                    _d.label = 1;
                case 1:
                    params = {};
                    if (options) {
                        if (listSegment && listSegment.meta && listSegment.meta.cursor) {
                            cursorParamName = options.isBackward
                                ? "cursor:prev"
                                : "cursor";
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            params[cursorParamName] = listSegment.meta.cursor;
                        }
                        else {
                            // Filters
                            if (options.dateFilter) {
                                for (_i = 0, _a = options.dateFilter.serialize('date'); _i < _a.length; _i++) {
                                    fragment = _a[_i];
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                    params[fragment.key] = fragment.value;
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, tslib.__await(restClient.invoke('GET', "/credits/daily-usage", params, undefined, undefined, cancellationToken))];
                case 2:
                    response = _d.sent();
                    return [4 /*yield*/, tslib.__await(response.deserialize())];
                case 3:
                    // TODO: Check the response status code
                    listSegment = _d.sent();
                    _b = 0, _c = listSegment.data;
                    _d.label = 4;
                case 4:
                    if (!(_b < _c.length)) return [3 /*break*/, 8];
                    item = _c[_b];
                    if (cancellationToken) {
                        cancellationToken.throwIfCancellationRequested();
                    }
                    return [4 /*yield*/, tslib.__await(item)];
                case 5: return [4 /*yield*/, _d.sent()];
                case 6:
                    _d.sent();
                    _d.label = 7;
                case 7:
                    _b++;
                    return [3 /*break*/, 4];
                case 8:
                    if ((listSegment.meta || {}).isTruncated) return [3 /*break*/, 1];
                    _d.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
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
var CreditsRestClient = /** @class */ (function () {
    function CreditsRestClient(restClientFactory) {
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
    CreditsRestClient.prototype.getBalance = function (cancellationToken) {
        return getCreditsBalance(this._restClientFactory, cancellationToken);
    };
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
     *
     * @param options A `DailyUsageListingOptions` with the options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    CreditsRestClient.prototype.listDailyUsages = function (options, cancellationToken) {
        return listCreditsDailyUsages(this._restClientFactory, options, cancellationToken);
    };
    return CreditsRestClient;
}());

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
 * Thrown in the event all the Verifalia API endpoints are unreachable.
 */
var ServiceUnreachableError = /** @class */ (function (_super) {
    tslib.__extends(ServiceUnreachableError, _super);
    /**
     *
     */
    function ServiceUnreachableError(innerErrors) {
        var _this = 
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        _super.call(this, "All the base URIs are unreachable: " + innerErrors.map(function (error) { return "" + error; }).join(', ')) || this;
        _this.innerErrors = innerErrors;
        return _this;
    }
    return ServiceUnreachableError;
}(VerifaliaError));

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
 * Thrown in the rare event a Verifalia API endpoint returns an HTTP server error status code (HTTP 5xx).
 */
var EndpointServerError = /** @class */ (function (_super) {
    tslib.__extends(EndpointServerError, _super);
    function EndpointServerError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EndpointServerError;
}(VerifaliaError));

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
 * Thrown in the event the user is unable to authenticate to Verifalia.
 */
var AuthorizationError = /** @class */ (function (_super) {
    tslib.__extends(AuthorizationError, _super);
    function AuthorizationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AuthorizationError;
}(VerifaliaError));

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
 * Thrown in the event a request exceeded the maximum configured email validations rate or the maximum number
 * of concurrent requests from the same IP address.
 */
var RequestThrottledError = /** @class */ (function (_super) {
    tslib.__extends(RequestThrottledError, _super);
    function RequestThrottledError() {
        return _super.call(this, "The current request has been throttled; please try again later.") || this;
    }
    return RequestThrottledError;
}(VerifaliaError));

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
 * Thrown when the credit of the requesting account is not enough to accept a given
 * email validation job.
 *
 * To add credit packs to your Verifalia account please visit https://verifalia.com/client-area#/credits/add
 */
var InsufficientCreditError = /** @class */ (function (_super) {
    tslib.__extends(InsufficientCreditError, _super);
    function InsufficientCreditError() {
        return _super.call(this, "The credit of the requesting account is too low to complete the operation: please visit https://verifalia.com/client-area#/credits/add to add credit packs to your account.") || this;
    }
    return InsufficientCreditError;
}(VerifaliaError));

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
 * JSON content-type.
 */
var MimeContentType_ApplicationJson = 'application/json';
/**
 * Plain-text files (.txt), with one email address per line.
 */
var MimeContentType_TextPlain = 'text/plain';
/**
 * Comma-separated values (.csv).
 */
var MimeContentType_TextCsv = 'text/csv';
/**
 * Tab-separated values (usually coming with the .tsv extension).
 */
var MimeContentType_TextTsv = 'text/tab-separated-values';
/**
 * Microsoft Excel 97-2003 Worksheet (.xls).
 */
var MimeContentType_ExcelXls = 'application/vnd.ms-excel';
/**
 * Microsoft Excel workbook (.xslx).
 */
var MimeContentType_ExcelXlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * @copyright 2015 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/**
 * @typedef {object} PrivateData
 * @property {EventTarget} eventTarget The event target.
 * @property {{type:string}} event The original event object.
 * @property {number} eventPhase The current event phase.
 * @property {EventTarget|null} currentTarget The current event target.
 * @property {boolean} canceled The flag to prevent default.
 * @property {boolean} stopped The flag to stop propagation.
 * @property {boolean} immediateStopped The flag to stop propagation immediately.
 * @property {Function|null} passiveListener The listener if the current listener is passive. Otherwise this is null.
 * @property {number} timeStamp The unix time.
 * @private
 */

/**
 * Private data for event wrappers.
 * @type {WeakMap<Event, PrivateData>}
 * @private
 */
const privateData = new WeakMap();

/**
 * Cache for wrapper classes.
 * @type {WeakMap<Object, Function>}
 * @private
 */
const wrappers = new WeakMap();

/**
 * Get private data.
 * @param {Event} event The event object to get private data.
 * @returns {PrivateData} The private data of the event.
 * @private
 */
function pd(event) {
    const retv = privateData.get(event);
    console.assert(
        retv != null,
        "'this' is expected an Event object, but got",
        event
    );
    return retv
}

/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 * @param data {PrivateData} private data.
 */
function setCancelFlag(data) {
    if (data.passiveListener != null) {
        if (
            typeof console !== "undefined" &&
            typeof console.error === "function"
        ) {
            console.error(
                "Unable to preventDefault inside passive event listener invocation.",
                data.passiveListener
            );
        }
        return
    }
    if (!data.event.cancelable) {
        return
    }

    data.canceled = true;
    if (typeof data.event.preventDefault === "function") {
        data.event.preventDefault();
    }
}

/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
function Event(eventTarget, event) {
    privateData.set(this, {
        eventTarget,
        event,
        eventPhase: 2,
        currentTarget: eventTarget,
        canceled: false,
        stopped: false,
        immediateStopped: false,
        passiveListener: null,
        timeStamp: event.timeStamp || Date.now(),
    });

    // https://heycam.github.io/webidl/#Unforgeable
    Object.defineProperty(this, "isTrusted", { value: false, enumerable: true });

    // Define accessors
    const keys = Object.keys(event);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in this)) {
            Object.defineProperty(this, key, defineRedirectDescriptor(key));
        }
    }
}

// Should be enumerable, but class methods are not enumerable.
Event.prototype = {
    /**
     * The type of this event.
     * @type {string}
     */
    get type() {
        return pd(this).event.type
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get target() {
        return pd(this).eventTarget
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get currentTarget() {
        return pd(this).currentTarget
    },

    /**
     * @returns {EventTarget[]} The composed path of this event.
     */
    composedPath() {
        const currentTarget = pd(this).currentTarget;
        if (currentTarget == null) {
            return []
        }
        return [currentTarget]
    },

    /**
     * Constant of NONE.
     * @type {number}
     */
    get NONE() {
        return 0
    },

    /**
     * Constant of CAPTURING_PHASE.
     * @type {number}
     */
    get CAPTURING_PHASE() {
        return 1
    },

    /**
     * Constant of AT_TARGET.
     * @type {number}
     */
    get AT_TARGET() {
        return 2
    },

    /**
     * Constant of BUBBLING_PHASE.
     * @type {number}
     */
    get BUBBLING_PHASE() {
        return 3
    },

    /**
     * The target of this event.
     * @type {number}
     */
    get eventPhase() {
        return pd(this).eventPhase
    },

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopPropagation() {
        const data = pd(this);

        data.stopped = true;
        if (typeof data.event.stopPropagation === "function") {
            data.event.stopPropagation();
        }
    },

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopImmediatePropagation() {
        const data = pd(this);

        data.stopped = true;
        data.immediateStopped = true;
        if (typeof data.event.stopImmediatePropagation === "function") {
            data.event.stopImmediatePropagation();
        }
    },

    /**
     * The flag to be bubbling.
     * @type {boolean}
     */
    get bubbles() {
        return Boolean(pd(this).event.bubbles)
    },

    /**
     * The flag to be cancelable.
     * @type {boolean}
     */
    get cancelable() {
        return Boolean(pd(this).event.cancelable)
    },

    /**
     * Cancel this event.
     * @returns {void}
     */
    preventDefault() {
        setCancelFlag(pd(this));
    },

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */
    get defaultPrevented() {
        return pd(this).canceled
    },

    /**
     * The flag to be composed.
     * @type {boolean}
     */
    get composed() {
        return Boolean(pd(this).event.composed)
    },

    /**
     * The unix time of this event.
     * @type {number}
     */
    get timeStamp() {
        return pd(this).timeStamp
    },

    /**
     * The target of this event.
     * @type {EventTarget}
     * @deprecated
     */
    get srcElement() {
        return pd(this).eventTarget
    },

    /**
     * The flag to stop event bubbling.
     * @type {boolean}
     * @deprecated
     */
    get cancelBubble() {
        return pd(this).stopped
    },
    set cancelBubble(value) {
        if (!value) {
            return
        }
        const data = pd(this);

        data.stopped = true;
        if (typeof data.event.cancelBubble === "boolean") {
            data.event.cancelBubble = true;
        }
    },

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     * @deprecated
     */
    get returnValue() {
        return !pd(this).canceled
    },
    set returnValue(value) {
        if (!value) {
            setCancelFlag(pd(this));
        }
    },

    /**
     * Initialize this event object. But do nothing under event dispatching.
     * @param {string} type The event type.
     * @param {boolean} [bubbles=false] The flag to be possible to bubble up.
     * @param {boolean} [cancelable=false] The flag to be possible to cancel.
     * @deprecated
     */
    initEvent() {
        // Do nothing.
    },
};

// `constructor` is not enumerable.
Object.defineProperty(Event.prototype, "constructor", {
    value: Event,
    configurable: true,
    writable: true,
});

// Ensure `event instanceof window.Event` is `true`.
if (typeof window !== "undefined" && typeof window.Event !== "undefined") {
    Object.setPrototypeOf(Event.prototype, window.Event.prototype);

    // Make association for wrappers.
    wrappers.set(window.Event.prototype, Event);
}

/**
 * Get the property descriptor to redirect a given property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to redirect the property.
 * @private
 */
function defineRedirectDescriptor(key) {
    return {
        get() {
            return pd(this).event[key]
        },
        set(value) {
            pd(this).event[key] = value;
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Get the property descriptor to call a given method property.
 * @param {string} key Property name to define property descriptor.
 * @returns {PropertyDescriptor} The property descriptor to call the method property.
 * @private
 */
function defineCallDescriptor(key) {
    return {
        value() {
            const event = pd(this).event;
            return event[key].apply(event, arguments)
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Define new wrapper class.
 * @param {Function} BaseEvent The base wrapper class.
 * @param {Object} proto The prototype of the original event.
 * @returns {Function} The defined wrapper class.
 * @private
 */
function defineWrapper(BaseEvent, proto) {
    const keys = Object.keys(proto);
    if (keys.length === 0) {
        return BaseEvent
    }

    /** CustomEvent */
    function CustomEvent(eventTarget, event) {
        BaseEvent.call(this, eventTarget, event);
    }

    CustomEvent.prototype = Object.create(BaseEvent.prototype, {
        constructor: { value: CustomEvent, configurable: true, writable: true },
    });

    // Define accessors.
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (!(key in BaseEvent.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            const isFunc = typeof descriptor.value === "function";
            Object.defineProperty(
                CustomEvent.prototype,
                key,
                isFunc
                    ? defineCallDescriptor(key)
                    : defineRedirectDescriptor(key)
            );
        }
    }

    return CustomEvent
}

/**
 * Get the wrapper class of a given prototype.
 * @param {Object} proto The prototype of the original event to get its wrapper.
 * @returns {Function} The wrapper class.
 * @private
 */
function getWrapper(proto) {
    if (proto == null || proto === Object.prototype) {
        return Event
    }

    let wrapper = wrappers.get(proto);
    if (wrapper == null) {
        wrapper = defineWrapper(getWrapper(Object.getPrototypeOf(proto)), proto);
        wrappers.set(proto, wrapper);
    }
    return wrapper
}

/**
 * Wrap a given event to management a dispatching.
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Object} event The event to wrap.
 * @returns {Event} The wrapper instance.
 * @private
 */
function wrapEvent(eventTarget, event) {
    const Wrapper = getWrapper(Object.getPrototypeOf(event));
    return new Wrapper(eventTarget, event)
}

/**
 * Get the immediateStopped flag of a given event.
 * @param {Event} event The event to get.
 * @returns {boolean} The flag to stop propagation immediately.
 * @private
 */
function isStopped(event) {
    return pd(event).immediateStopped
}

/**
 * Set the current event phase of a given event.
 * @param {Event} event The event to set current target.
 * @param {number} eventPhase New event phase.
 * @returns {void}
 * @private
 */
function setEventPhase(event, eventPhase) {
    pd(event).eventPhase = eventPhase;
}

/**
 * Set the current target of a given event.
 * @param {Event} event The event to set current target.
 * @param {EventTarget|null} currentTarget New current target.
 * @returns {void}
 * @private
 */
function setCurrentTarget(event, currentTarget) {
    pd(event).currentTarget = currentTarget;
}

/**
 * Set a passive listener of a given event.
 * @param {Event} event The event to set current target.
 * @param {Function|null} passiveListener New passive listener.
 * @returns {void}
 * @private
 */
function setPassiveListener(event, passiveListener) {
    pd(event).passiveListener = passiveListener;
}

/**
 * @typedef {object} ListenerNode
 * @property {Function} listener
 * @property {1|2|3} listenerType
 * @property {boolean} passive
 * @property {boolean} once
 * @property {ListenerNode|null} next
 * @private
 */

/**
 * @type {WeakMap<object, Map<string, ListenerNode>>}
 * @private
 */
const listenersMap = new WeakMap();

// Listener types
const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x !== null && typeof x === "object" //eslint-disable-line no-restricted-syntax
}

/**
 * Get listeners.
 * @param {EventTarget} eventTarget The event target to get.
 * @returns {Map<string, ListenerNode>} The listeners.
 * @private
 */
function getListeners(eventTarget) {
    const listeners = listenersMap.get(eventTarget);
    if (listeners == null) {
        throw new TypeError(
            "'this' is expected an EventTarget object, but got another value."
        )
    }
    return listeners
}

/**
 * Get the property descriptor for the event attribute of a given event.
 * @param {string} eventName The event name to get property descriptor.
 * @returns {PropertyDescriptor} The property descriptor.
 * @private
 */
function defineEventAttributeDescriptor(eventName) {
    return {
        get() {
            const listeners = getListeners(this);
            let node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    return node.listener
                }
                node = node.next;
            }
            return null
        },

        set(listener) {
            if (typeof listener !== "function" && !isObject(listener)) {
                listener = null; // eslint-disable-line no-param-reassign
            }
            const listeners = getListeners(this);

            // Traverse to the tail while removing old value.
            let prev = null;
            let node = listeners.get(eventName);
            while (node != null) {
                if (node.listenerType === ATTRIBUTE) {
                    // Remove old value.
                    if (prev !== null) {
                        prev.next = node.next;
                    } else if (node.next !== null) {
                        listeners.set(eventName, node.next);
                    } else {
                        listeners.delete(eventName);
                    }
                } else {
                    prev = node;
                }

                node = node.next;
            }

            // Add new value.
            if (listener !== null) {
                const newNode = {
                    listener,
                    listenerType: ATTRIBUTE,
                    passive: false,
                    once: false,
                    next: null,
                };
                if (prev === null) {
                    listeners.set(eventName, newNode);
                } else {
                    prev.next = newNode;
                }
            }
        },
        configurable: true,
        enumerable: true,
    }
}

/**
 * Define an event attribute (e.g. `eventTarget.onclick`).
 * @param {Object} eventTargetPrototype The event target prototype to define an event attrbite.
 * @param {string} eventName The event name to define.
 * @returns {void}
 */
function defineEventAttribute(eventTargetPrototype, eventName) {
    Object.defineProperty(
        eventTargetPrototype,
        `on${eventName}`,
        defineEventAttributeDescriptor(eventName)
    );
}

/**
 * Define a custom EventTarget with event attributes.
 * @param {string[]} eventNames Event names for event attributes.
 * @returns {EventTarget} The custom EventTarget.
 * @private
 */
function defineCustomEventTarget(eventNames) {
    /** CustomEventTarget */
    function CustomEventTarget() {
        EventTarget.call(this);
    }

    CustomEventTarget.prototype = Object.create(EventTarget.prototype, {
        constructor: {
            value: CustomEventTarget,
            configurable: true,
            writable: true,
        },
    });

    for (let i = 0; i < eventNames.length; ++i) {
        defineEventAttribute(CustomEventTarget.prototype, eventNames[i]);
    }

    return CustomEventTarget
}

/**
 * EventTarget.
 *
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 *
 * For example:
 *
 *     class A extends EventTarget {}
 *     class B extends EventTarget("message") {}
 *     class C extends EventTarget("message", "error") {}
 *     class D extends EventTarget(["message", "error"]) {}
 */
function EventTarget() {
    /*eslint-disable consistent-return */
    if (this instanceof EventTarget) {
        listenersMap.set(this, new Map());
        return
    }
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return defineCustomEventTarget(arguments[0])
    }
    if (arguments.length > 0) {
        const types = new Array(arguments.length);
        for (let i = 0; i < arguments.length; ++i) {
            types[i] = arguments[i];
        }
        return defineCustomEventTarget(types)
    }
    throw new TypeError("Cannot call a class as a function")
    /*eslint-enable consistent-return */
}

// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */
    addEventListener(eventName, listener, options) {
        if (listener == null) {
            return
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.")
        }

        const listeners = getListeners(this);
        const optionsIsObj = isObject(options);
        const capture = optionsIsObj
            ? Boolean(options.capture)
            : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null,
        };

        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return
        }

        // Traverse to the tail while checking duplication..
        let prev = null;
        while (node != null) {
            if (
                node.listener === listener &&
                node.listenerType === listenerType
            ) {
                // Should ignore duplication.
                return
            }
            prev = node;
            node = node.next;
        }

        // Add it.
        prev.next = newNode;
    },

    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {void}
     */
    removeEventListener(eventName, listener, options) {
        if (listener == null) {
            return
        }

        const listeners = getListeners(this);
        const capture = isObject(options)
            ? Boolean(options.capture)
            : Boolean(options);
        const listenerType = capture ? CAPTURE : BUBBLE;

        let prev = null;
        let node = listeners.get(eventName);
        while (node != null) {
            if (
                node.listener === listener &&
                node.listenerType === listenerType
            ) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return
            }

            prev = node;
            node = node.next;
        }
    },

    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent(event) {
        if (event == null || typeof event.type !== "string") {
            throw new TypeError('"event.type" should be a string.')
        }

        // If listeners aren't registered, terminate.
        const listeners = getListeners(this);
        const eventName = event.type;
        let node = listeners.get(eventName);
        if (node == null) {
            return true
        }

        // Since we cannot rewrite several properties, so wrap object.
        const wrappedEvent = wrapEvent(this, event);

        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null;
        while (node != null) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev !== null) {
                    prev.next = node.next;
                } else if (node.next !== null) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }

            // Call this listener
            setPassiveListener(
                wrappedEvent,
                node.passive ? node.listener : null
            );
            if (typeof node.listener === "function") {
                try {
                    node.listener.call(this, wrappedEvent);
                } catch (err) {
                    if (
                        typeof console !== "undefined" &&
                        typeof console.error === "function"
                    ) {
                        console.error(err);
                    }
                }
            } else if (
                node.listenerType !== ATTRIBUTE &&
                typeof node.listener.handleEvent === "function"
            ) {
                node.listener.handleEvent(wrappedEvent);
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (isStopped(wrappedEvent)) {
                break
            }

            node = node.next;
        }
        setPassiveListener(wrappedEvent, null);
        setEventPhase(wrappedEvent, 0);
        setCurrentTarget(wrappedEvent, null);

        return !wrappedEvent.defaultPrevented
    },
};

// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", {
    value: EventTarget,
    configurable: true,
    writable: true,
});

// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if (
    typeof window !== "undefined" &&
    typeof window.EventTarget !== "undefined"
) {
    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
}

/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 * See LICENSE file in root directory for full license.
 */

/**
 * The signal class.
 * @see https://dom.spec.whatwg.org/#abortsignal
 */
class AbortSignal extends EventTarget {
    /**
     * AbortSignal cannot be constructed directly.
     */
    constructor() {
        super();
        throw new TypeError("AbortSignal cannot be constructed directly");
    }
    /**
     * Returns `true` if this `AbortSignal`'s `AbortController` has signaled to abort, and `false` otherwise.
     */
    get aborted() {
        const aborted = abortedFlags.get(this);
        if (typeof aborted !== "boolean") {
            throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
        }
        return aborted;
    }
}
defineEventAttribute(AbortSignal.prototype, "abort");
/**
 * Create an AbortSignal object.
 */
function createAbortSignal() {
    const signal = Object.create(AbortSignal.prototype);
    EventTarget.call(signal);
    abortedFlags.set(signal, false);
    return signal;
}
/**
 * Abort a given signal.
 */
function abortSignal(signal) {
    if (abortedFlags.get(signal) !== false) {
        return;
    }
    abortedFlags.set(signal, true);
    signal.dispatchEvent({ type: "abort" });
}
/**
 * Aborted flag for each instances.
 */
const abortedFlags = new WeakMap();
// Properties should be enumerable.
Object.defineProperties(AbortSignal.prototype, {
    aborted: { enumerable: true },
});
// `toString()` should return `"[object AbortSignal]"`
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortSignal.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortSignal",
    });
}

/**
 * The AbortController.
 * @see https://dom.spec.whatwg.org/#abortcontroller
 */
class AbortController {
    /**
     * Initialize this controller.
     */
    constructor() {
        signals.set(this, createAbortSignal());
    }
    /**
     * Returns the `AbortSignal` object associated with this object.
     */
    get signal() {
        return getSignal(this);
    }
    /**
     * Abort and signal to any observers that the associated activity is to be aborted.
     */
    abort() {
        abortSignal(getSignal(this));
    }
}
/**
 * Associated signals.
 */
const signals = new WeakMap();
/**
 * Get the associated signal of a given controller.
 */
function getSignal(controller) {
    const signal = signals.get(controller);
    if (signal == null) {
        throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${controller === null ? "null" : typeof controller}`);
    }
    return signal;
}
// Properties should be enumerable.
Object.defineProperties(AbortController.prototype, {
    signal: { enumerable: true },
    abort: { enumerable: true },
});
if (typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol") {
    Object.defineProperty(AbortController.prototype, Symbol.toStringTag, {
        configurable: true,
        value: "AbortController",
    });
}

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob$1 {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob$1) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob$1([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob$1.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob$1.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob$1([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__default : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

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
var MultiplexedRestClient = /** @class */ (function () {
    function MultiplexedRestClient(authenticator, baseUris, userAgent) {
        if (userAgent === void 0) { userAgent = undefined; }
        if (!authenticator)
            throw new Error('authenticator is null');
        if (!baseUris || !baseUris.length)
            throw new Error('baseUris is null or empty');
        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
        this._noOfInvocations = 0;
    }
    MultiplexedRestClient.prototype.invoke = function (method, resource, params, data, configOverride, cancellationToken) {
        return tslib.__awaiter(this, void 0, void 0, function () {
            var errors, abortController, onCanceled, _loop_1, this_1, idxAttempt, state_1;
            var _this = this;
            return tslib.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = [];
                        abortController = new AbortController();
                        onCanceled = function () { return abortController.abort(); };
                        if (cancellationToken) {
                            cancellationToken.register(onCanceled);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 6, 7]);
                        _loop_1 = function (idxAttempt) {
                            var baseUri, requestInit, queryString, url, response, error_1, _a, _b;
                            return tslib.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        baseUri = this_1._baseUris[this_1._noOfInvocations++ % this_1._baseUris.length];
                                        requestInit = {
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
                                        if (this_1._userAgent) {
                                            requestInit.headers = tslib.__assign(tslib.__assign({}, requestInit.headers), { 'User-Agent': this_1._userAgent });
                                        }
                                        if (method === 'POST' || method === 'PUT') {
                                            requestInit.headers = tslib.__assign(tslib.__assign({}, requestInit.headers), { 
                                                // Default posted MIME content type
                                                'Content-Type': MimeContentType_ApplicationJson });
                                        }
                                        requestInit = tslib.__assign(tslib.__assign({}, requestInit), configOverride);
                                        return [4 /*yield*/, this_1._authenticator.decorateRequest(this_1, requestInit)];
                                    case 1:
                                        _c.sent();
                                        queryString = params
                                            ? Object
                                                .entries(params)
                                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                                .map(function (_a) {
                                                var key = _a[0];
                                                return key + "=" + encodeURIComponent(params[key]);
                                            })
                                                .join('&')
                                            : null;
                                        url = "" + baseUri + resource + (queryString ? '?' + queryString : '');
                                        _c.label = 2;
                                    case 2:
                                        _c.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, fetch(url, requestInit)];
                                    case 3:
                                        response = _c.sent();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_1 = _c.sent();
                                        if (error_1.name === 'AbortError') {
                                            // The request has been canceled
                                            throw new OperationCanceledError();
                                        }
                                        errors.push(error_1);
                                        return [2 /*return*/, "continue"];
                                    case 5:
                                        // Internal server error HTTP 5xx
                                        if (response.status >= 500 && response.status <= 599) {
                                            errors.push(new EndpointServerError("Endpoint " + baseUri + " returned an HTTP " + response.status + " status code."));
                                            return [2 /*return*/, "continue"];
                                        }
                                        if (!(response.status === 401 || response.status === 403)) return [3 /*break*/, 7];
                                        _a = AuthorizationError.bind;
                                        _b = response.statusText;
                                        return [4 /*yield*/, response.text()];
                                    case 6: throw new (_a.apply(AuthorizationError, [void 0, _b + (_c.sent()) + ' ' + url]))();
                                    case 7:
                                        // Payment required
                                        if (response.status === 402) {
                                            throw new InsufficientCreditError();
                                        }
                                        // Throttling
                                        if (response.status === 429) {
                                            throw new RequestThrottledError();
                                        }
                                        return [2 /*return*/, { value: {
                                                    deserialize: function () { return tslib.__awaiter(_this, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, response.json()];
                                                            case 1: return [2 /*return*/, (_a.sent())];
                                                        }
                                                    }); }); },
                                                    response: response,
                                                    // Obsolete fields, for backward compatibility only
                                                    status: response.status,
                                                    statusText: response.statusText,
                                                    body: response.body,
                                                } }];
                                }
                            });
                        };
                        this_1 = this;
                        idxAttempt = 0;
                        _a.label = 2;
                    case 2:
                        if (!(idxAttempt < this._baseUris.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_1(idxAttempt)];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 4;
                    case 4:
                        idxAttempt++;
                        return [3 /*break*/, 2];
                    case 5: throw new ServiceUnreachableError(errors);
                    case 6:
                        if (cancellationToken) {
                            cancellationToken.unregister(onCanceled);
                        }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return MultiplexedRestClient;
}());

// generated by genversion
var version = '3.2.1';

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
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
var VerifaliaRestClientFactory = /** @class */ (function () {
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     *
     * @param authenticator The authenticator used to invoke the Verifalia service.
     * @param baseUris The base Verifalia API endpoints used to invoke the Verifalia service.
     */
    function VerifaliaRestClientFactory(authenticator, baseUris) {
        /**
         * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
         * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
         */
        this.apiVersion = 'v2.3';
        if (!authenticator)
            throw new Error('authenticator is null');
        if (!baseUris || baseUris.length < 1)
            throw new Error('baseUris is null or has no items');
        this._authenticator = authenticator;
        this._baseUris = baseUris;
    }
    VerifaliaRestClientFactory.prototype.build = function () {
        var _a;
        var _this = this;
        if (!this._cachedRestClient) {
            // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)
            var shuffledUris = tslib.__spreadArrays(this._baseUris);
            for (var i = shuffledUris.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [shuffledUris[j], shuffledUris[i]], shuffledUris[i] = _a[0], shuffledUris[j] = _a[1];
            }
            this._cachedRestClient = new MultiplexedRestClient(this._authenticator, shuffledUris.map(function (uri) { return uri + "/" + _this.apiVersion; }), this.getUserAgent());
        }
        return this._cachedRestClient;
    };
    VerifaliaRestClientFactory.prototype.getUserAgent = function () {
        var _a;
        var isNode = (typeof process !== 'undefined') && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node);
        if (isNode) {
            return "verifalia-rest-client/js/" + version + "/node/" + (process.platform + '/' + process.version) + ",target:" + 'node' + ",format:" + 'cjs';
        }
        // Since we can't force the User-Agent header in the browser, we return it as undefined here so that
        // the related header won't be set later, while making requests to the API.
        return undefined;
    };
    return VerifaliaRestClientFactory;
}());

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
 * Allows to authenticate against the Verifalia API using with either a username-password
 * credentials pair or with a browser app-key.
 */
var UsernamePasswordAuthenticator = /** @class */ (function () {
    function UsernamePasswordAuthenticator(username, password) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }
        this._username = username;
        this._password = password || '';
    }
    UsernamePasswordAuthenticator.prototype.decorateRequest = function (restClient, requestInit) {
        requestInit.headers = tslib.__assign(tslib.__assign({}, requestInit.headers), { 'Authorization': 'Basic ' +
                Buffer.from(this._username + ":" + this._password).toString('base64') });
        return Promise.resolve();
    };
    return UsernamePasswordAuthenticator;
}());

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
 * Allows to authenticate against the Verifalia API using an X.509 client certificate.
 * Learn more: https://verifalia.com/help/sub-accounts/what-is-x509-tls-client-certificate-authentication
 */
var ClientCertificateAuthenticator = /** @class */ (function () {
    function ClientCertificateAuthenticator(cert, key, passphrase) {
        if (!cert) {
            throw Error('Invalid client certificate chain.');
        }
        this._agent = new https.Agent({
            cert: cert,
            key: key,
            passphrase: passphrase
        });
    }
    ClientCertificateAuthenticator.prototype.decorateRequest = function (restClient, requestInit) {
        // This will always be invoked in a Node.js-only context
        requestInit.agent = this._agent;
        return Promise.resolve();
    };
    return ClientCertificateAuthenticator;
}());

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
var VerifaliaRestClient = /** @class */ (function () {
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
    function VerifaliaRestClient(config) {
        var _a, _b;
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
        var authenticator;
        var baseUris;
        if (config.username) {
            // User-name password authentication
            authenticator = new UsernamePasswordAuthenticator(config.username, config.password);
            baseUris = (_a = config.baseUris) !== null && _a !== void 0 ? _a : this._baseUris;
        }
        else if (config.cert) {
            // X.509 client certificate authentication (Node.js only)
            authenticator = new ClientCertificateAuthenticator(config.cert, config.key, config.passphrase);
            baseUris = (_b = config.baseUris) !== null && _b !== void 0 ? _b : this._baseCcaUris;
        }
        else {
            throw new Error('Invalid configuration: either specify your user credentials, your browser-app key or your client certificate.');
        }
        this._restClientfactory = new VerifaliaRestClientFactory(authenticator, baseUris);
        this.credits = new CreditsRestClient(this._restClientfactory);
        this.emailValidations = new EmailValidationsRestClient(this._restClientfactory);
    }
    return VerifaliaRestClient;
}());

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
var FilterPredicate = /** @class */ (function () {
    function FilterPredicate() {
    }
    return FilterPredicate;
}());

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
var DateFilterPredicate = /** @class */ (function (_super) {
    tslib.__extends(DateFilterPredicate, _super);
    function DateFilterPredicate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DateFilterPredicate;
}(FilterPredicate));

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
// Adapted from https://stackoverflow.com/a/23593099/904178
var formatDateToIso8601 = function (date) {
    var month = "" + (date.getMonth() + 1);
    var day = "" + date.getDate();
    var year = date.getFullYear();
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
var DateEqualityPredicate = /** @class */ (function (_super) {
    tslib.__extends(DateEqualityPredicate, _super);
    function DateEqualityPredicate(date) {
        var _this = _super.call(this) || this;
        _this.date = date;
        return _this;
    }
    DateEqualityPredicate.prototype.serialize = function (fieldName) {
        return [
            {
                key: fieldName,
                value: "" + formatDateToIso8601(this.date)
            }
        ];
    };
    return DateEqualityPredicate;
}(DateFilterPredicate));

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
var DateBetweenPredicate = /** @class */ (function (_super) {
    tslib.__extends(DateBetweenPredicate, _super);
    function DateBetweenPredicate(since, until) {
        var _this = _super.call(this) || this;
        _this.since = since;
        _this.until = until;
        return _this;
    }
    DateBetweenPredicate.prototype.serialize = function (fieldName) {
        var fragments = [];
        if (this.since) {
            fragments.push({
                key: fieldName + ":since",
                value: formatDateToIso8601(this.since)
            });
        }
        if (this.until) {
            fragments.push({
                key: fieldName + ":until",
                value: formatDateToIso8601(this.until)
            });
        }
        return fragments;
    };
    return DateBetweenPredicate;
}(DateFilterPredicate));

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
var CancellationToken = /** @class */ (function () {
    function CancellationToken() {
        this._isCanceled = false;
        this._callbacks = [];
    }
    CancellationToken.prototype.isCanceled = function () {
        return this._isCanceled;
    };
    CancellationToken.prototype.register = function (callback) {
        if (this._isCanceled) {
            callback();
            return;
        }
        this._callbacks.push(callback);
    };
    CancellationToken.prototype.unregister = function (callback) {
        var index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    };
    CancellationToken.prototype.cancel = function () {
        this._isCanceled = true;
        for (var _i = 0, _a = this._callbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            callback();
        }
        this._callbacks = [];
    };
    CancellationToken.prototype.throwIfCancellationRequested = function () {
        if (this.isCanceled()) {
            throw new OperationCanceledError();
        }
    };
    return CancellationToken;
}());

exports.AuthorizationError = AuthorizationError;
exports.CancellationToken = CancellationToken;
exports.ClientCertificateAuthenticator = ClientCertificateAuthenticator;
exports.CreditsRestClient = CreditsRestClient;
exports.DateBetweenPredicate = DateBetweenPredicate;
exports.DateEqualityPredicate = DateEqualityPredicate;
exports.DeduplicationMode_Off = DeduplicationMode_Off;
exports.DeduplicationMode_Relaxed = DeduplicationMode_Relaxed;
exports.DeduplicationMode_Safe = DeduplicationMode_Safe;
exports.EmailValidationsRestClient = EmailValidationsRestClient;
exports.EndpointServerError = EndpointServerError;
exports.InsufficientCreditError = InsufficientCreditError;
exports.MimeContentType_ApplicationJson = MimeContentType_ApplicationJson;
exports.MimeContentType_ExcelXls = MimeContentType_ExcelXls;
exports.MimeContentType_ExcelXlsx = MimeContentType_ExcelXlsx;
exports.MimeContentType_TextCsv = MimeContentType_TextCsv;
exports.MimeContentType_TextPlain = MimeContentType_TextPlain;
exports.MimeContentType_TextTsv = MimeContentType_TextTsv;
exports.OperationCanceledError = OperationCanceledError;
exports.QualityLevelName_Extreme = QualityLevelName_Extreme;
exports.QualityLevelName_High = QualityLevelName_High;
exports.QualityLevelName_Standard = QualityLevelName_Standard;
exports.RequestThrottledError = RequestThrottledError;
exports.ServiceUnreachableError = ServiceUnreachableError;
exports.UsernamePasswordAuthenticator = UsernamePasswordAuthenticator;
exports.ValidationEntryClassification_Deliverable = ValidationEntryClassification_Deliverable;
exports.ValidationEntryClassification_Risky = ValidationEntryClassification_Risky;
exports.ValidationEntryClassification_Undeliverable = ValidationEntryClassification_Undeliverable;
exports.ValidationEntryClassification_Unknown = ValidationEntryClassification_Unknown;
exports.ValidationEntryStatus_AtSignNotFound = ValidationEntryStatus_AtSignNotFound;
exports.ValidationEntryStatus_CatchAllConnectionFailure = ValidationEntryStatus_CatchAllConnectionFailure;
exports.ValidationEntryStatus_CatchAllValidationTimeout = ValidationEntryStatus_CatchAllValidationTimeout;
exports.ValidationEntryStatus_DnsConnectionFailure = ValidationEntryStatus_DnsConnectionFailure;
exports.ValidationEntryStatus_DnsQueryTimeout = ValidationEntryStatus_DnsQueryTimeout;
exports.ValidationEntryStatus_DomainDoesNotExist = ValidationEntryStatus_DomainDoesNotExist;
exports.ValidationEntryStatus_DomainHasNullMx = ValidationEntryStatus_DomainHasNullMx;
exports.ValidationEntryStatus_DomainIsMisconfigured = ValidationEntryStatus_DomainIsMisconfigured;
exports.ValidationEntryStatus_DomainIsWellKnownDea = ValidationEntryStatus_DomainIsWellKnownDea;
exports.ValidationEntryStatus_DomainPartCompliancyFailure = ValidationEntryStatus_DomainPartCompliancyFailure;
exports.ValidationEntryStatus_DoubleDotSequence = ValidationEntryStatus_DoubleDotSequence;
exports.ValidationEntryStatus_Duplicate = ValidationEntryStatus_Duplicate;
exports.ValidationEntryStatus_InvalidAddressLength = ValidationEntryStatus_InvalidAddressLength;
exports.ValidationEntryStatus_InvalidCharacterInSequence = ValidationEntryStatus_InvalidCharacterInSequence;
exports.ValidationEntryStatus_InvalidEmptyQuotedWord = ValidationEntryStatus_InvalidEmptyQuotedWord;
exports.ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence = ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence;
exports.ValidationEntryStatus_InvalidLocalPartLength = ValidationEntryStatus_InvalidLocalPartLength;
exports.ValidationEntryStatus_InvalidWordBoundaryStart = ValidationEntryStatus_InvalidWordBoundaryStart;
exports.ValidationEntryStatus_IspSpecificSyntaxFailure = ValidationEntryStatus_IspSpecificSyntaxFailure;
exports.ValidationEntryStatus_LocalEndPointRejected = ValidationEntryStatus_LocalEndPointRejected;
exports.ValidationEntryStatus_LocalPartIsWellKnownRoleAccount = ValidationEntryStatus_LocalPartIsWellKnownRoleAccount;
exports.ValidationEntryStatus_LocalSenderAddressRejected = ValidationEntryStatus_LocalSenderAddressRejected;
exports.ValidationEntryStatus_MailExchangerIsHoneypot = ValidationEntryStatus_MailExchangerIsHoneypot;
exports.ValidationEntryStatus_MailExchangerIsWellKnownDea = ValidationEntryStatus_MailExchangerIsWellKnownDea;
exports.ValidationEntryStatus_MailboxConnectionFailure = ValidationEntryStatus_MailboxConnectionFailure;
exports.ValidationEntryStatus_MailboxDoesNotExist = ValidationEntryStatus_MailboxDoesNotExist;
exports.ValidationEntryStatus_MailboxIsDea = ValidationEntryStatus_MailboxIsDea;
exports.ValidationEntryStatus_MailboxTemporarilyUnavailable = ValidationEntryStatus_MailboxTemporarilyUnavailable;
exports.ValidationEntryStatus_MailboxValidationTimeout = ValidationEntryStatus_MailboxValidationTimeout;
exports.ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes = ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes;
exports.ValidationEntryStatus_ServerIsCatchAll = ValidationEntryStatus_ServerIsCatchAll;
exports.ValidationEntryStatus_ServerTemporaryUnavailable = ValidationEntryStatus_ServerTemporaryUnavailable;
exports.ValidationEntryStatus_SmtpConnectionFailure = ValidationEntryStatus_SmtpConnectionFailure;
exports.ValidationEntryStatus_SmtpConnectionTimeout = ValidationEntryStatus_SmtpConnectionTimeout;
exports.ValidationEntryStatus_SmtpDialogError = ValidationEntryStatus_SmtpDialogError;
exports.ValidationEntryStatus_Success = ValidationEntryStatus_Success;
exports.ValidationEntryStatus_UnacceptableDomainLiteral = ValidationEntryStatus_UnacceptableDomainLiteral;
exports.ValidationEntryStatus_UnbalancedCommentParenthesis = ValidationEntryStatus_UnbalancedCommentParenthesis;
exports.ValidationEntryStatus_UnexpectedQuotedPairSequence = ValidationEntryStatus_UnexpectedQuotedPairSequence;
exports.ValidationEntryStatus_UnhandledException = ValidationEntryStatus_UnhandledException;
exports.ValidationEntryStatus_UnmatchedQuotedPair = ValidationEntryStatus_UnmatchedQuotedPair;
exports.ValidationPriority_Highest = ValidationPriority_Highest;
exports.ValidationPriority_Lowest = ValidationPriority_Lowest;
exports.ValidationPriority_Normal = ValidationPriority_Normal;
exports.ValidationStatus_Completed = ValidationStatus_Completed;
exports.ValidationStatus_Deleted = ValidationStatus_Deleted;
exports.ValidationStatus_Expired = ValidationStatus_Expired;
exports.ValidationStatus_InProgress = ValidationStatus_InProgress;
exports.VerifaliaRestClient = VerifaliaRestClient;
exports.VerifaliaRestClientFactory = VerifaliaRestClientFactory;
exports.WaitingStrategy = WaitingStrategy;
exports.deleteEmailValidation = deleteEmailValidation;
exports.exportEmailValidationEntries = exportEmailValidationEntries;
exports.getCreditsBalance = getCreditsBalance;
exports.getEmailValidation = getEmailValidation;
exports.listCreditsDailyUsages = listCreditsDailyUsages;
exports.listEmailValidations = listEmailValidations;
exports.submitEmailValidation = submitEmailValidation;
exports.submitEmailValidationFile = submitEmailValidationFile;
