// (c) Verifalia - email verification service - https://verifalia.com
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
/**
 * The email validation job is being processed by Verifalia. The completion progress, if any, is available
 * through the progress property
 */
const ValidationStatus_InProgress = 'InProgress';
/**
 * The email validation job has been completed and its results are available.
 */
const ValidationStatus_Completed = 'Completed';
/**
 * The email validation job has either been deleted.
 */
const ValidationStatus_Deleted = 'Deleted';
/**
 * The email validation job is expired.
 */
const ValidationStatus_Expired = 'Expired';
/**
 * Duplicates detection is turned off.
 */
const DeduplicationMode_Off = 'Off';
/**
 * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
 * false duplicates.
 */
const DeduplicationMode_Safe = 'Safe';
/**
 * Identifies duplicates using a set of relaxed rules which assume the target email
 * service providers are configured with modern settings only (instead of the broader
 * options the RFCs from the '80s allow).
 */
const DeduplicationMode_Relaxed = 'Relaxed';
/**
 * The Standard quality level. Suitable for most businesses, provides good results for the
 * vast majority of email addresses; features a single validation pass and 5 second anti-tarpit
 * time; less suitable for validating email addresses with temporary issues (mailbox over
 * quota, greylisting, etc.) and slower mail exchangers.
 */
const QualityLevelName_Standard = 'Standard';
/**
 * The High quality level. Much higher quality, featuring 3 validation passes and 50 seconds
 * of anti-tarpit time, so you can even validate most addresses with temporary issues, or
 * slower mail exchangers.
 */
const QualityLevelName_High = 'High';
/**
 * The Extreme quality level. Unbeatable, top-notch quality for professionals who need the best
 * results the industry can offer: performs email validations at the highest level, with 9
 * validation passes and 2 minutes of anti-tarpit time.
 */
const QualityLevelName_Extreme = 'Extreme';
/**
 * A validation entry marked as Deliverable refers to an email address which is deliverable.
 */
const ValidationEntryClassification_Deliverable = 'Deliverable';
/**
 * A validation entry marked as Risky refers to an email address which could be no longer valid.
 */
const ValidationEntryClassification_Risky = 'Risky';
/**
 * A validation entry marked as Undeliverable refers to an email address which is either invalid or
 * no longer deliverable.
 */
const ValidationEntryClassification_Undeliverable = 'Undeliverable';
/**
 * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
 */
const ValidationEntryClassification_Unknown = 'Unknown';
/**
 * The email address has been successfully validated.
 */
const ValidationEntryStatus_Success = 'Success';
/**
 * A quoted pair within a quoted word is not closed properly.
 */
const ValidationEntryStatus_UnmatchedQuotedPair = 'UnmatchedQuotedPair';
/**
 * An unexpected quoted pair sequence has been found within a quoted word.
 */
const ValidationEntryStatus_UnexpectedQuotedPairSequence = 'UnexpectedQuotedPairSequence';
/** A new word boundary start has been detected at an invalid position.
*/
const ValidationEntryStatus_InvalidWordBoundaryStart = 'InvalidWordBoundaryStart';
/** An invalid character has been detected in the provided sequence.
*/
const ValidationEntryStatus_InvalidCharacterInSequence = 'InvalidCharacterInSequence';
/** The number of parenthesis used to open comments is not equal to the one used to close them.
*/
const ValidationEntryStatus_UnbalancedCommentParenthesis = 'UnbalancedCommentParenthesis';
/** An invalid sequence of two adjacent dots has been found.
*/
const ValidationEntryStatus_DoubleDotSequence = 'DoubleDotSequence';
/** The local part of the e-mail address has an invalid length.
*/
const ValidationEntryStatus_InvalidLocalPartLength = 'InvalidLocalPartLength';
/** An invalid folding white space (FWS) sequence has been found.
*/
const ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence = 'InvalidFoldingWhiteSpaceSequence';
/** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
*/
const ValidationEntryStatus_AtSignNotFound = 'AtSignNotFound';
/** An invalid quoted word with no content has been found.
*/
const ValidationEntryStatus_InvalidEmptyQuotedWord = 'InvalidEmptyQuotedWord';
/** The email address has an invalid total length.
*/
const ValidationEntryStatus_InvalidAddressLength = 'InvalidAddressLength';
/** The domain part of the email address is not compliant with the IETF standards.
*/
const ValidationEntryStatus_DomainPartCompliancyFailure = 'DomainPartCompliancyFailure';
/** The email address is not compliant with the additional syntax rules of the email service provider
* which should eventually manage it.
*/
const ValidationEntryStatus_IspSpecificSyntaxFailure = 'IspSpecificSyntaxFailure';
/** The local part of the email address is a well-known role account. */
const ValidationEntryStatus_LocalPartIsWellKnownRoleAccount = 'LocalPartIsWellKnownRoleAccount;';
/** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
const ValidationEntryStatus_DnsQueryTimeout = 'DnsQueryTimeout';
/** Verification failed because of a socket connection error occured while querying the DNS server.
*/
const ValidationEntryStatus_DnsConnectionFailure = 'DnsConnectionFailure';
/** The domain of the email address does not exist.
*/
const ValidationEntryStatus_DomainDoesNotExist = 'DomainDoesNotExist';
/** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
* host on the Internet.
*/
const ValidationEntryStatus_DomainIsMisconfigured = 'DomainIsMisconfigured';
/** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
 */
const ValidationEntryStatus_DomainHasNullMx = 'DomainHasNullMx';
/** The email address is provided by a well-known disposable email address provider (DEA).
*/
const ValidationEntryStatus_DomainIsWellKnownDea = 'DomainIsWellKnownDea';
/** The mail exchanger being tested is a well-known disposable email address provider (DEA).
*/
const ValidationEntryStatus_MailExchangerIsWellKnownDea = 'MailExchangerIsWellKnownDea';
/** While both the domain and the mail exchanger for the email address being tested are not from a well-known
* disposable email address provider (DEA); the mailbox is actually disposable.
*/
const ValidationEntryStatus_MailboxIsDea = 'MailboxIsDea';
/** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
*/
const ValidationEntryStatus_SmtpConnectionTimeout = 'SmtpConnectionTimeout';
/** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
*/
const ValidationEntryStatus_SmtpConnectionFailure = 'SmtpConnectionFailure';
/** The mailbox for the e-mail address does not exist.
*/
const ValidationEntryStatus_MailboxDoesNotExist = 'MailboxDoesNotExist';
/** A connection error occurred while validating the mailbox for the e-mail address.
*/
const ValidationEntryStatus_MailboxConnectionFailure = 'MailboxConnectionFailure';
/** The external mail exchanger rejected the validation request.
*/
const ValidationEntryStatus_LocalSenderAddressRejected = 'LocalSenderAddressRejected';
/** A timeout occured while verifying the existence of the mailbox.
*/
const ValidationEntryStatus_MailboxValidationTimeout = 'MailboxValidationTimeout';
/** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
* (could be over quota; for example).
*/
const ValidationEntryStatus_MailboxTemporarilyUnavailable = 'MailboxTemporarilyUnavailable';
/** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
 * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
 * protocol extensions.
*/
const ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes = 'ServerDoesNotSupportInternationalMailboxes';
/** A timeout occured while verifying fake e-mail address rejection for the mail server.
*/
const ValidationEntryStatus_CatchAllValidationTimeout = 'CatchAllValidationTimeout';
/** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
*/
const ValidationEntryStatus_ServerIsCatchAll = 'ServerIsCatchAll';
/** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
*/
const ValidationEntryStatus_CatchAllConnectionFailure = 'CatchAllConnectionFailure';
/** The mail exchanger responsible for the email address under test is temporarily unavailable.
*/
const ValidationEntryStatus_ServerTemporaryUnavailable = 'ServerTemporaryUnavailable';
/** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
* caused the SMTP session to be aborted.
*/
const ValidationEntryStatus_SmtpDialogError = 'SmtpDialogError';
/** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
* of its own policy rules.
*/
const ValidationEntryStatus_LocalEndPointRejected = 'LocalEndPointRejected';
/** One or more unhandled exceptions have been thrown during the verification process and something went wrong
* on the Verifalia side.
*/
const ValidationEntryStatus_UnhandledException = 'UnhandledException';
/** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
*/
const ValidationEntryStatus_MailExchangerIsHoneypot = 'MailExchangerIsHoneypot';
/** The domain literal of the email address couldn't accept messages from the Internet. */
const ValidationEntryStatus_UnacceptableDomainLiteral = 'UnacceptableDomainLiteral';
/**
 * The item is a duplicate of another email address in the list.
 * To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
 * instance which exposes this status code</remarks>
 */
const ValidationEntryStatus_Duplicate = 'Duplicate';
/**
 * The mail exchanger responsible for the email address is parked / inactive.
 */
const ValidationEntryStatus_MailExchangerIsParked = 'MailExchangerIsParked';
/**
 * The system assigned a user-defined classification because the input data met the criteria specified in a
 * custom classification override rule..
 */
const ValidationEntryStatus_OverrideMatch = 'OverrideMatch';
/**
 * The lowest possible processing priority (speed) for a validation job.
 */
const ValidationPriority_Lowest = 0;
/**
 * Normal processing priority (speed) for a validation job.
 */
const ValidationPriority_Normal = 127;
/**
 * The highest possible relative processing priority (speed) for a validation job.
 */
const ValidationPriority_Highest = 255;
/**
 * hCaptcha.
 */
const CaptchaProvider_HCaptcha = 'hCaptcha';
/**
 * Google reCAPTCHA v2.
 */
const CaptchaProvider_ReCaptchaV2 = 'reCaptcha_v2';
/**
 * Google reCAPTCHA v3.
 */
const CaptchaProvider_ReCaptchaV3 = 'reCaptcha_v3';
/**
 * Cloudflare Turnstile.
 */
const CaptchaProvider_Turnstile = 'Turnstile';

export { CaptchaProvider_HCaptcha, CaptchaProvider_ReCaptchaV2, CaptchaProvider_ReCaptchaV3, CaptchaProvider_Turnstile, DeduplicationMode_Off, DeduplicationMode_Relaxed, DeduplicationMode_Safe, QualityLevelName_Extreme, QualityLevelName_High, QualityLevelName_Standard, ValidationEntryClassification_Deliverable, ValidationEntryClassification_Risky, ValidationEntryClassification_Undeliverable, ValidationEntryClassification_Unknown, ValidationEntryStatus_AtSignNotFound, ValidationEntryStatus_CatchAllConnectionFailure, ValidationEntryStatus_CatchAllValidationTimeout, ValidationEntryStatus_DnsConnectionFailure, ValidationEntryStatus_DnsQueryTimeout, ValidationEntryStatus_DomainDoesNotExist, ValidationEntryStatus_DomainHasNullMx, ValidationEntryStatus_DomainIsMisconfigured, ValidationEntryStatus_DomainIsWellKnownDea, ValidationEntryStatus_DomainPartCompliancyFailure, ValidationEntryStatus_DoubleDotSequence, ValidationEntryStatus_Duplicate, ValidationEntryStatus_InvalidAddressLength, ValidationEntryStatus_InvalidCharacterInSequence, ValidationEntryStatus_InvalidEmptyQuotedWord, ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence, ValidationEntryStatus_InvalidLocalPartLength, ValidationEntryStatus_InvalidWordBoundaryStart, ValidationEntryStatus_IspSpecificSyntaxFailure, ValidationEntryStatus_LocalEndPointRejected, ValidationEntryStatus_LocalPartIsWellKnownRoleAccount, ValidationEntryStatus_LocalSenderAddressRejected, ValidationEntryStatus_MailExchangerIsHoneypot, ValidationEntryStatus_MailExchangerIsParked, ValidationEntryStatus_MailExchangerIsWellKnownDea, ValidationEntryStatus_MailboxConnectionFailure, ValidationEntryStatus_MailboxDoesNotExist, ValidationEntryStatus_MailboxIsDea, ValidationEntryStatus_MailboxTemporarilyUnavailable, ValidationEntryStatus_MailboxValidationTimeout, ValidationEntryStatus_OverrideMatch, ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes, ValidationEntryStatus_ServerIsCatchAll, ValidationEntryStatus_ServerTemporaryUnavailable, ValidationEntryStatus_SmtpConnectionFailure, ValidationEntryStatus_SmtpConnectionTimeout, ValidationEntryStatus_SmtpDialogError, ValidationEntryStatus_Success, ValidationEntryStatus_UnacceptableDomainLiteral, ValidationEntryStatus_UnbalancedCommentParenthesis, ValidationEntryStatus_UnexpectedQuotedPairSequence, ValidationEntryStatus_UnhandledException, ValidationEntryStatus_UnmatchedQuotedPair, ValidationPriority_Highest, ValidationPriority_Lowest, ValidationPriority_Normal, ValidationStatus_Completed, ValidationStatus_Deleted, ValidationStatus_Expired, ValidationStatus_InProgress };
