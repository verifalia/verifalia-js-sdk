// (c) Verifalia - email verification service - https://verifalia.com
System.register('verifalia', ['tslib'], function (exports) {
    'use strict';
    var __extends, __awaiter, __generator, __asyncGenerator, __await, __rest, __assign, __spreadArrays;
    return {
        setters: [function (module) {
            __extends = module.__extends;
            __awaiter = module.__awaiter;
            __generator = module.__generator;
            __asyncGenerator = module.__asyncGenerator;
            __await = module.__await;
            __rest = module.__rest;
            __assign = module.__assign;
            __spreadArrays = module.__spreadArrays;
        }],
        execute: function () {

            exports({
                deleteEmailValidation: deleteEmailValidation,
                getEmailValidation: getEmailValidation,
                listCreditsDailyUsages: listCreditsDailyUsages,
                listEmailValidations: listEmailValidations,
                submitEmailValidation: submitEmailValidation,
                submitEmailValidationFile: submitEmailValidationFile
            });

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
             * Thrown whenever an async method is canceled.
             */
            var OperationCanceledError = exports('OperationCanceledError', /** @class */ (function (_super) {
                __extends(OperationCanceledError, _super);
                /**
                 *
                 */
                function OperationCanceledError() {
                    return _super.call(this, 'The operation was canceled') || this;
                }
                return OperationCanceledError;
            }(VerifaliaError)));

            var timeSpanMatchRegex = /^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/;
            var WaitingStrategy = exports('WaitingStrategy', /** @class */ (function () {
                function WaitingStrategy(waitForCompletion, progress) {
                    if (progress === void 0) { progress = null; }
                    this.waitForCompletion = waitForCompletion;
                    this.progress = progress;
                }
                WaitingStrategy.prototype.waitForNextPoll = function (validationOverview, cancellationToken) {
                    return __awaiter(this, void 0, void 0, function () {
                        var delay, timespanMatch, hours, minutes, seconds;
                        return __generator(this, function (_a) {
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
            }()));

            /**
             * The email validation job is being processed by Verifalia. The completion progress, if any, is available
             * through the progress property
             */
            var ValidationStatus_InProgress = exports('ValidationStatus_InProgress', 'InProgress');
            /**
             * The email validation job has been completed and its results are available.
             */
            var ValidationStatus_Completed = exports('ValidationStatus_Completed', 'Completed');
            /**
             * The email validation job has either been deleted.
             */
            var ValidationStatus_Deleted = exports('ValidationStatus_Deleted', 'Deleted');
            /**
             * The email validation job is expired.
             */
            var ValidationStatus_Expired = exports('ValidationStatus_Expired', 'Expired');
            /**
             * Duplicates detection is turned off.
             */
            var DeduplicationMode_Off = exports('DeduplicationMode_Off', 'Off');
            /**
             * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
             * false duplicates.
             */
            var DeduplicationMode_Safe = exports('DeduplicationMode_Safe', 'Safe');
            /**
             * Identifies duplicates using a set of relaxed rules which assume the target email
             * service providers are configured with modern settings only (instead of the broader
             * options the RFCs from the '80s allow).
             */
            var DeduplicationMode_Relaxed = exports('DeduplicationMode_Relaxed', 'Relaxed');
            /**
             * The Standard quality level. Suitable for most businesses, provides good results for the
             * vast majority of email addresses; features a single validation pass and 5 second anti-tarpit
             * time; less suitable for validating email addresses with temporary issues (mailbox over
             * quota, greylisting, etc.) and slower mail exchangers.
             */
            var QualityLevelName_Standard = exports('QualityLevelName_Standard', 'Standard');
            /**
             * The High quality level. Much higher quality, featuring 3 validation passes and 50 seconds
             * of anti-tarpit time, so you can even validate most addresses with temporary issues, or
             * slower mail exchangers.
             */
            var QualityLevelName_High = exports('QualityLevelName_High', 'High');
            /**
             * The Extreme quality level. Unbeatable, top-notch quality for professionals who need the best
             * results the industry can offer: performs email validations at the highest level, with 9
             * validation passes and 2 minutes of anti-tarpit time.
             */
            var QualityLevelName_Extreme = exports('QualityLevelName_Extreme', 'Extreme');
            /**
             * A validation entry marked as Deliverable refers to an email address which is deliverable.
             */
            var ValidationEntryClassification_Deliverable = exports('ValidationEntryClassification_Deliverable', 'Deliverable');
            /**
             * A validation entry marked as Risky refers to an email address which could be no longer valid.
             */
            var ValidationEntryClassification_Risky = exports('ValidationEntryClassification_Risky', 'Risky');
            /**
             * A validation entry marked as Undeliverable refers to an email address which is either invalid or
             * no longer deliverable.
             */
            var ValidationEntryClassification_Undeliverable = exports('ValidationEntryClassification_Undeliverable', 'Undeliverable');
            /**
             * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
             */
            var ValidationEntryClassification_Unknown = exports('ValidationEntryClassification_Unknown', 'Unknown');
            /**
             * The email address has been successfully validated.
             */
            var ValidationEntryStatus_Success = exports('ValidationEntryStatus_Success', 'Success');
            /**
             * A quoted pair within a quoted word is not closed properly.
             */
            var ValidationEntryStatus_UnmatchedQuotedPair = exports('ValidationEntryStatus_UnmatchedQuotedPair', 'UnmatchedQuotedPair');
            /**
             * An unexpected quoted pair sequence has been found within a quoted word.
             */
            var ValidationEntryStatus_UnexpectedQuotedPairSequence = exports('ValidationEntryStatus_UnexpectedQuotedPairSequence', 'UnexpectedQuotedPairSequence');
            /** A new word boundary start has been detected at an invalid position.
            */
            var ValidationEntryStatus_InvalidWordBoundaryStart = exports('ValidationEntryStatus_InvalidWordBoundaryStart', 'InvalidWordBoundaryStart');
            /** An invalid character has been detected in the provided sequence.
            */
            var ValidationEntryStatus_InvalidCharacterInSequence = exports('ValidationEntryStatus_InvalidCharacterInSequence', 'InvalidCharacterInSequence');
            /** The number of parenthesis used to open comments is not equal to the one used to close them.
            */
            var ValidationEntryStatus_UnbalancedCommentParenthesis = exports('ValidationEntryStatus_UnbalancedCommentParenthesis', 'UnbalancedCommentParenthesis');
            /** An invalid sequence of two adjacent dots has been found.
            */
            var ValidationEntryStatus_DoubleDotSequence = exports('ValidationEntryStatus_DoubleDotSequence', 'DoubleDotSequence');
            /** The local part of the e-mail address has an invalid length.
            */
            var ValidationEntryStatus_InvalidLocalPartLength = exports('ValidationEntryStatus_InvalidLocalPartLength', 'InvalidLocalPartLength');
            /** An invalid folding white space (FWS) sequence has been found.
            */
            var ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence = exports('ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence', 'InvalidFoldingWhiteSpaceSequence');
            /** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
            */
            var ValidationEntryStatus_AtSignNotFound = exports('ValidationEntryStatus_AtSignNotFound', 'AtSignNotFound');
            /** An invalid quoted word with no content has been found.
            */
            var ValidationEntryStatus_InvalidEmptyQuotedWord = exports('ValidationEntryStatus_InvalidEmptyQuotedWord', 'InvalidEmptyQuotedWord');
            /** The email address has an invalid total length.
            */
            var ValidationEntryStatus_InvalidAddressLength = exports('ValidationEntryStatus_InvalidAddressLength', 'InvalidAddressLength');
            /** The domain part of the email address is not compliant with the IETF standards.
            */
            var ValidationEntryStatus_DomainPartCompliancyFailure = exports('ValidationEntryStatus_DomainPartCompliancyFailure', 'DomainPartCompliancyFailure');
            /** The email address is not compliant with the additional syntax rules of the email service provider
            * which should eventually manage it.
            */
            var ValidationEntryStatus_IspSpecificSyntaxFailure = exports('ValidationEntryStatus_IspSpecificSyntaxFailure', 'IspSpecificSyntaxFailure');
            /** The local part of the email address is a well-known role account. */
            var ValidationEntryStatus_LocalPartIsWellKnownRoleAccount = exports('ValidationEntryStatus_LocalPartIsWellKnownRoleAccount', 'LocalPartIsWellKnownRoleAccount;');
            /** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
            var ValidationEntryStatus_DnsQueryTimeout = exports('ValidationEntryStatus_DnsQueryTimeout', 'DnsQueryTimeout');
            /** Verification failed because of a socket connection error occured while querying the DNS server.
            */
            var ValidationEntryStatus_DnsConnectionFailure = exports('ValidationEntryStatus_DnsConnectionFailure', 'DnsConnectionFailure');
            /** The domain of the email address does not exist.
            */
            var ValidationEntryStatus_DomainDoesNotExist = exports('ValidationEntryStatus_DomainDoesNotExist', 'DomainDoesNotExist');
            /** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
            * host on the Internet.
            */
            var ValidationEntryStatus_DomainIsMisconfigured = exports('ValidationEntryStatus_DomainIsMisconfigured', 'DomainIsMisconfigured');
            /** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
             */
            var ValidationEntryStatus_DomainHasNullMx = exports('ValidationEntryStatus_DomainHasNullMx', 'DomainHasNullMx');
            /** The email address is provided by a well-known disposable email address provider (DEA).
            */
            var ValidationEntryStatus_DomainIsWellKnownDea = exports('ValidationEntryStatus_DomainIsWellKnownDea', 'DomainIsWellKnownDea');
            /** The mail exchanger being tested is a well-known disposable email address provider (DEA).
            */
            var ValidationEntryStatus_MailExchangerIsWellKnownDea = exports('ValidationEntryStatus_MailExchangerIsWellKnownDea', 'MailExchangerIsWellKnownDea');
            /** While both the domain and the mail exchanger for the email address being tested are not from a well-known
            * disposable email address provider (DEA); the mailbox is actually disposable.
            */
            var ValidationEntryStatus_MailboxIsDea = exports('ValidationEntryStatus_MailboxIsDea', 'MailboxIsDea');
            /** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
            */
            var ValidationEntryStatus_SmtpConnectionTimeout = exports('ValidationEntryStatus_SmtpConnectionTimeout', 'SmtpConnectionTimeout');
            /** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
            */
            var ValidationEntryStatus_SmtpConnectionFailure = exports('ValidationEntryStatus_SmtpConnectionFailure', 'SmtpConnectionFailure');
            /** The mailbox for the e-mail address does not exist.
            */
            var ValidationEntryStatus_MailboxDoesNotExist = exports('ValidationEntryStatus_MailboxDoesNotExist', 'MailboxDoesNotExist');
            /** A connection error occurred while validating the mailbox for the e-mail address.
            */
            var ValidationEntryStatus_MailboxConnectionFailure = exports('ValidationEntryStatus_MailboxConnectionFailure', 'MailboxConnectionFailure');
            /** The external mail exchanger rejected the validation request.
            */
            var ValidationEntryStatus_LocalSenderAddressRejected = exports('ValidationEntryStatus_LocalSenderAddressRejected', 'LocalSenderAddressRejected');
            /** A timeout occured while verifying the existence of the mailbox.
            */
            var ValidationEntryStatus_MailboxValidationTimeout = exports('ValidationEntryStatus_MailboxValidationTimeout', 'MailboxValidationTimeout');
            /** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
            * (could be over quota; for example).
            */
            var ValidationEntryStatus_MailboxTemporarilyUnavailable = exports('ValidationEntryStatus_MailboxTemporarilyUnavailable', 'MailboxTemporarilyUnavailable');
            /** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
             * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
             * protocol extensions.
            */
            var ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes = exports('ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes', 'ServerDoesNotSupportInternationalMailboxes');
            /** A timeout occured while verifying fake e-mail address rejection for the mail server.
            */
            var ValidationEntryStatus_CatchAllValidationTimeout = exports('ValidationEntryStatus_CatchAllValidationTimeout', 'CatchAllValidationTimeout');
            /** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
            */
            var ValidationEntryStatus_ServerIsCatchAll = exports('ValidationEntryStatus_ServerIsCatchAll', 'ServerIsCatchAll');
            /** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
            */
            var ValidationEntryStatus_CatchAllConnectionFailure = exports('ValidationEntryStatus_CatchAllConnectionFailure', 'CatchAllConnectionFailure');
            /** The mail exchanger responsible for the email address under test is temporarily unavailable.
            */
            var ValidationEntryStatus_ServerTemporaryUnavailable = exports('ValidationEntryStatus_ServerTemporaryUnavailable', 'ServerTemporaryUnavailable');
            /** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
            * caused the SMTP session to be aborted.
            */
            var ValidationEntryStatus_SmtpDialogError = exports('ValidationEntryStatus_SmtpDialogError', 'SmtpDialogError');
            /** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
            * of its own policy rules.
            */
            var ValidationEntryStatus_LocalEndPointRejected = exports('ValidationEntryStatus_LocalEndPointRejected', 'LocalEndPointRejected');
            /** One or more unhandled exceptions have been thrown during the verification process and something went wrong
            * on the Verifalia side.
            */
            var ValidationEntryStatus_UnhandledException = exports('ValidationEntryStatus_UnhandledException', 'UnhandledException');
            /** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
            */
            var ValidationEntryStatus_MailExchangerIsHoneypot = exports('ValidationEntryStatus_MailExchangerIsHoneypot', 'MailExchangerIsHoneypot');
            /** The domain literal of the email address couldn't accept messages from the Internet. */
            var ValidationEntryStatus_UnacceptableDomainLiteral = exports('ValidationEntryStatus_UnacceptableDomainLiteral', 'UnacceptableDomainLiteral');
            /**
             * The item is a duplicate of another email address in the list.
             * To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
             * instance which exposes this status code</remarks>
             */
            var ValidationEntryStatus_Duplicate = exports('ValidationEntryStatus_Duplicate', 'Duplicate');
            /**
             * The lowest possible processing priority (speed) for a validation job.
             */
            var ValidationPriority_Lowest = exports('ValidationPriority_Lowest', 0);
            /**
             * Normal processing priority (speed) for a validation job.
             */
            var ValidationPriority_Normal = exports('ValidationPriority_Normal', 127);
            /**
             * The highest possible relative processing priority (speed) for a validation job.
             */
            var ValidationPriority_Highest = exports('ValidationPriority_Highest', 255);

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
                return __awaiter(this, void 0, void 0, function () {
                    var restClient, data, entries, response;
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var restClient, formData, headers, fillFormData, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                restClient = restClientFactory.build();
                                headers = {};
                                fillFormData = function () {
                                    var _a, _b;
                                    var file = request.file, settings = __rest(request, ["file"]);
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
                return __awaiter(this, void 0, void 0, function () {
                    var partialValidation;
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var restClient, response, partialValidation;
                    return __generator(this, function (_a) {
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
             * Deletes an email validation job previously submitted for processing.
             *
             * @param id The ID of the email validation job to delete.
             * @param cancellationToken An optional token used to cancel the asynchronous request.
             */
            function deleteEmailValidation(restClientFactory, id, cancellationToken) {
                return __awaiter(this, void 0, void 0, function () {
                    var restClient, response;
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var allEntries, currentSegment;
                    return __generator(this, function (_a) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var restClient, cursorParamName, queryParams, response;
                    var _a;
                    return __generator(this, function (_b) {
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
                return __awaiter(this, void 0, void 0, function () {
                    var resultOverview, result;
                    return __generator(this, function (_a) {
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
                return __asyncGenerator(this, arguments, function listEmailValidations_1() {
                    var restClient, listSegment, params, cursorParamName, _i, _a, fragment, response, _b, _c, item;
                    return __generator(this, function (_d) {
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
                                return [4 /*yield*/, __await(restClient.invoke('GET', "/email-validations", params, undefined, undefined, cancellationToken))];
                            case 2:
                                response = _d.sent();
                                return [4 /*yield*/, __await(response.deserialize())];
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
                                return [4 /*yield*/, __await(item)];
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

            var EmailValidationsRestClient = exports('EmailValidationsRestClient', /** @class */ (function () {
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
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
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
                return EmailValidationsRestClient;
            }()));

            /**
             * Returns the current credits balance for the Verifalia account.
             *
             * @param cancellationToken An optional token used to cancel the asynchronous request.
             */
            var getCreditsBalance = exports('getCreditsBalance', function (restClientFactory, cancellationToken) { return __awaiter(void 0, void 0, void 0, function () {
                var restClient;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            restClient = restClientFactory.build();
                            return [4 /*yield*/, restClient.invoke("GET", '/credits/balance', undefined, undefined, undefined, cancellationToken)];
                        case 1: return [4 /*yield*/, (_a.sent()).deserialize()];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            }); });
            /**
             * Lists the daily usages of the credits for the Verifalia account.
             *
             * @param options The options for the listing operation.
             * @param cancellationToken An optional token used to cancel the asynchronous request.
             */
            function listCreditsDailyUsages(restClientFactory, options, cancellationToken) {
                return __asyncGenerator(this, arguments, function listCreditsDailyUsages_1() {
                    var restClient, listSegment, params, cursorParamName, _i, _a, fragment, response, _b, _c, item;
                    return __generator(this, function (_d) {
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
                                return [4 /*yield*/, __await(restClient.invoke('GET', "/credits/daily-usage", params, undefined, undefined, cancellationToken))];
                            case 2:
                                response = _d.sent();
                                return [4 /*yield*/, __await(response.deserialize())];
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
                                return [4 /*yield*/, __await(item)];
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

            var CreditsRestClient = exports('CreditsRestClient', /** @class */ (function () {
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
            }()));

            /**
             * Thrown in the event all the Verifalia API endpoints are unreachable.
             */
            var ServiceUnreachableError = exports('ServiceUnreachableError', /** @class */ (function (_super) {
                __extends(ServiceUnreachableError, _super);
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
            }(VerifaliaError)));

            /**
             * Thrown in the rare event a Verifalia API endpoint returns an HTTP server error status code (HTTP 5xx).
             */
            var EndpointServerError = exports('EndpointServerError', /** @class */ (function (_super) {
                __extends(EndpointServerError, _super);
                function EndpointServerError() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return EndpointServerError;
            }(VerifaliaError)));

            /**
             * Thrown in the event the user is unable to authenticate to Verifalia.
             */
            var AuthorizationError = exports('AuthorizationError', /** @class */ (function (_super) {
                __extends(AuthorizationError, _super);
                function AuthorizationError() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return AuthorizationError;
            }(VerifaliaError)));

            /**
             * Thrown in the event a request exceeded the maximum configured email validations rate or the maximum number
             * of concurrent requests from the same IP address.
             */
            var RequestThrottledError = exports('RequestThrottledError', /** @class */ (function (_super) {
                __extends(RequestThrottledError, _super);
                function RequestThrottledError() {
                    return _super.call(this, "The current request has been throttled; please try again later.") || this;
                }
                return RequestThrottledError;
            }(VerifaliaError)));

            /**
             * Thrown when the credit of the requesting account is not enough to accept a given
             * email validation job.
             */
            var InsufficientCreditError = exports('InsufficientCreditError', /** @class */ (function (_super) {
                __extends(InsufficientCreditError, _super);
                function InsufficientCreditError() {
                    return _super.call(this, "The credit of the requesting account is too low to complete the operation.") || this;
                }
                return InsufficientCreditError;
            }(VerifaliaError)));

            var MimeContentType_ApplicationJson = exports('MimeContentType_ApplicationJson', 'application/json');
            /**
             * Plain-text files (.txt), with one email address per line.
             */
            var MimeContentType_TextPlain = exports('MimeContentType_TextPlain', 'text/plain');
            /**
             * Comma-separated values (.csv).
             */
            var MimeContentType_TextCsv = exports('MimeContentType_TextCsv', 'text/csv');
            /**
             * Tab-separated values (usually coming with the .tsv extension).
             */
            var MimeContentType_TextTsv = exports('MimeContentType_TextTsv', 'text/tab-separated-values');
            /**
             * Microsoft Excel 97-2003 Worksheet (.xls).
             */
            var MimeContentType_ExcelXls = exports('MimeContentType_ExcelXls', 'application/vnd.ms-excel');
            /**
             * Microsoft Excel workbook (.xslx).
             */
            var MimeContentType_ExcelXlsx = exports('MimeContentType_ExcelXlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            /* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
                    return __awaiter(this, void 0, void 0, function () {
                        var errors, abortController, onCanceled, _loop_1, this_1, idxAttempt, state_1;
                        var _this = this;
                        return __generator(this, function (_a) {
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
                                        return __generator(this, function (_c) {
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
                                                        requestInit.headers = __assign(__assign({}, requestInit.headers), { 'User-Agent': this_1._userAgent });
                                                    }
                                                    if (method === 'POST' || method === 'PUT') {
                                                        requestInit.headers = __assign(__assign({}, requestInit.headers), { 
                                                            // Default posted MIME content type
                                                            'Content-Type': MimeContentType_ApplicationJson });
                                                    }
                                                    requestInit = __assign(__assign({}, requestInit), configOverride);
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
                                                                status: response.status,
                                                                statusText: response.statusText,
                                                                body: response.body,
                                                                deserialize: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                                    switch (_a.label) {
                                                                        case 0: return [4 /*yield*/, response.json()];
                                                                        case 1: return [2 /*return*/, (_a.sent())];
                                                                    }
                                                                }); }); }
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
            var version = '3.0.3';

            /**
             * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
             * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
             * as well as to allow for the tree shaker to do its job.
             */
            var VerifaliaRestClientFactory = exports('VerifaliaRestClientFactory', /** @class */ (function () {
                /**
                 * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
                 *
                 * @param authenticator The authenticator used to invoke the Verifalia service.
                 */
                function VerifaliaRestClientFactory(authenticator) {
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
                VerifaliaRestClientFactory.prototype.build = function () {
                    var _a;
                    var _this = this;
                    if (!this._cachedRestClient) {
                        // Initial uris shuffling (see https://stackoverflow.com/a/12646864/904178)
                        var shuffledUris = __spreadArrays(this._baseUris);
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
                        return "verifalia-rest-client/js/" + version + "/node/" + (process.platform + '/' + process.version) + ",target:" + 'browser' + ",format:" + 'system';
                    }
                    // Since we can't force the User-Agent header in the browser, we return it as undefined here so that
                    // the related header won't be set later, while making requests to the API.
                    return undefined;
                };
                return VerifaliaRestClientFactory;
            }()));

            var UsernamePasswordAuthenticator = exports('UsernamePasswordAuthenticator', /** @class */ (function () {
                function UsernamePasswordAuthenticator(username, password) {
                    if (!username && username.length === 0) {
                        throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
                    }
                    this._username = username;
                    this._password = password || '';
                }
                UsernamePasswordAuthenticator.prototype.decorateRequest = function (restClient, requestInit) {
                    requestInit.headers = __assign(__assign({}, requestInit.headers), { 'Authorization': 'Basic ' +
                            btoa(this._username + ":" + this._password) });
                    return Promise.resolve();
                };
                return UsernamePasswordAuthenticator;
            }()));

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
            var VerifaliaRestClient = exports('VerifaliaRestClient', /** @class */ (function () {
                /**
                 * Initializes a new HTTPS-based REST client for Verifalia with the specified configuration.
                 *
                 * @param config Contains the configuration for the Verifalia API client, including the credentials
                 * to use while authenticating to the Verifalia service.
                 */
                function VerifaliaRestClient(config) {
                    if (!config)
                        throw new Error('config is null');
                    if (!config.username)
                        throw new Error('username is null');
                    // Builds the authenticator
                    // TODO: Support X.509 client certificate authentication (on Node)
                    var authenticator = new UsernamePasswordAuthenticator(config.username, config.password);
                    this._restClientfactory = new VerifaliaRestClientFactory(authenticator);
                    this.credits = new CreditsRestClient(this._restClientfactory);
                    this.emailValidations = new EmailValidationsRestClient(this._restClientfactory);
                }
                return VerifaliaRestClient;
            }()));

            var FilterPredicate = /** @class */ (function () {
                function FilterPredicate() {
                }
                return FilterPredicate;
            }());

            var DateFilterPredicate = /** @class */ (function (_super) {
                __extends(DateFilterPredicate, _super);
                function DateFilterPredicate() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return DateFilterPredicate;
            }(FilterPredicate));

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

            var DateEqualityPredicate = exports('DateEqualityPredicate', /** @class */ (function (_super) {
                __extends(DateEqualityPredicate, _super);
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
            }(DateFilterPredicate)));

            var DateBetweenPredicate = exports('DateBetweenPredicate', /** @class */ (function (_super) {
                __extends(DateBetweenPredicate, _super);
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
            }(DateFilterPredicate)));

            var CancellationToken = exports('CancellationToken', /** @class */ (function () {
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
            }()));

        }
    };
});
