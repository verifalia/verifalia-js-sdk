/**
 * The email validation job is being processed by Verifalia. The completion progress, if any, is available
 * through the progress property
 */
export const ValidationStatus_InProgress = 'InProgress';
/**
 * The email validation job has been completed and its results are available.
 */
export const ValidationStatus_Completed = 'Completed';
/**
 * The email validation job has either been deleted.
 */
export const ValidationStatus_Deleted = 'Deleted';
/**
 * The email validation job is expired.
 */
export const ValidationStatus_Expired = 'Expired';

/**
 * Duplicates detection is turned off.
 */
export const DeduplicationMode_Off = 'Off';

/**
 * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
 * false duplicates.
 */
export const DeduplicationMode_Safe = 'Safe';

/**
 * Identifies duplicates using a set of relaxed rules which assume the target email
 * service providers are configured with modern settings only (instead of the broader
 * options the RFCs from the '80s allow).
 */
export const DeduplicationMode_Relaxed = 'Relaxed';

/**
 * The Standard quality level. Suitable for most businesses, provides good results for the
 * vast majority of email addresses; features a single validation pass and 5 second anti-tarpit
 * time; less suitable for validating email addresses with temporary issues (mailbox over
 * quota, greylisting, etc.) and slower mail exchangers.
 */
export const QualityLevelName_Standard = 'Standard';

/**
 * The High quality level. Much higher quality, featuring 3 validation passes and 50 seconds
 * of anti-tarpit time, so you can even validate most addresses with temporary issues, or
 * slower mail exchangers.
 */
export const QualityLevelName_High = 'High';

/**
 * The Extreme quality level. Unbeatable, top-notch quality for professionals who need the best
 * results the industry can offer: performs email validations at the highest level, with 9
 * validation passes and 2 minutes of anti-tarpit time.
 */
export const QualityLevelName_Extreme = 'Extreme';

/**
 * A validation entry marked as Deliverable refers to an email address which is deliverable.
 */
export const ValidationEntryClassification_Deliverable = 'Deliverable';

/**
 * A validation entry marked as Risky refers to an email address which could be no longer valid.
 */
export const ValidationEntryClassification_Risky = 'Risky';

/**
 * A validation entry marked as Undeliverable refers to an email address which is either invalid or
 * no longer deliverable.
 */
export const ValidationEntryClassification_Undeliverable = 'Undeliverable';

/**
 * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
 */
export const ValidationEntryClassification_Unknown = 'Unknown';

/** The email address has been successfully validated.
*/
export const ValidationEntryStatus_Success = 'Success';

/** A quoted pair within a quoted word is not closed properly.
*/
export const ValidationEntryStatus_UnmatchedQuotedPair = 'UnmatchedQuotedPair';

/** An unexpected quoted pair sequence has been found within a quoted word.
*/
export const ValidationEntryStatus_UnexpectedQuotedPairSequence = 'UnexpectedQuotedPairSequence';

/** A new word boundary start has been detected at an invalid position.
*/
export const ValidationEntryStatus_InvalidWordBoundaryStart = 'InvalidWordBoundaryStart';

/** An invalid character has been detected in the provided sequence.
*/
export const ValidationEntryStatus_InvalidCharacterInSequence = 'InvalidCharacterInSequence';

/** The number of parenthesis used to open comments is not equal to the one used to close them.
*/
export const ValidationEntryStatus_UnbalancedCommentParenthesis = 'UnbalancedCommentParenthesis';

/** An invalid sequence of two adjacent dots has been found.
*/
export const ValidationEntryStatus_DoubleDotSequence = 'DoubleDotSequence';

/** The local part of the e-mail address has an invalid length.
*/
export const ValidationEntryStatus_InvalidLocalPartLength = 'InvalidLocalPartLength';

/** An invalid folding white space (FWS) sequence has been found.
*/
export const ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence = 'InvalidFoldingWhiteSpaceSequence';

/** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
*/
export const ValidationEntryStatus_AtSignNotFound = 'AtSignNotFound';

/** An invalid quoted word with no content has been found.
*/
export const ValidationEntryStatus_InvalidEmptyQuotedWord = 'InvalidEmptyQuotedWord';

/** The email address has an invalid total length.
*/
export const ValidationEntryStatus_InvalidAddressLength = 'InvalidAddressLength';

/** The domain part of the email address is not compliant with the IETF standards.
*/
export const ValidationEntryStatus_DomainPartCompliancyFailure = 'DomainPartCompliancyFailure';

/** The email address is not compliant with the additional syntax rules of the email service provider
* which should eventually manage it.
*/
export const ValidationEntryStatus_IspSpecificSyntaxFailure = 'IspSpecificSyntaxFailure';

/** The local part of the email address is a well-known role account. */
export const ValidationEntryStatus_LocalPartIsWellKnownRoleAccount = 'LocalPartIsWellKnownRoleAccount;';

/** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
export const ValidationEntryStatus_DnsQueryTimeout = 'DnsQueryTimeout';

/** Verification failed because of a socket connection error occured while querying the DNS server.
*/
export const ValidationEntryStatus_DnsConnectionFailure = 'DnsConnectionFailure';

/** The domain of the email address does not exist.
*/
export const ValidationEntryStatus_DomainDoesNotExist = 'DomainDoesNotExist';

/** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
* host on the Internet.
*/
export const ValidationEntryStatus_DomainIsMisconfigured = 'DomainIsMisconfigured';

/** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
 */
export const ValidationEntryStatus_DomainHasNullMx = 'DomainHasNullMx';

/** The email address is provided by a well-known disposable email address provider (DEA).
*/
export const ValidationEntryStatus_DomainIsWellKnownDea = 'DomainIsWellKnownDea';

/** The mail exchanger being tested is a well-known disposable email address provider (DEA).
*/
export const ValidationEntryStatus_MailExchangerIsWellKnownDea = 'MailExchangerIsWellKnownDea';

/** While both the domain and the mail exchanger for the email address being tested are not from a well-known
* disposable email address provider (DEA); the mailbox is actually disposable.
*/
export const ValidationEntryStatus_MailboxIsDea = 'MailboxIsDea';

/** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
*/
export const ValidationEntryStatus_SmtpConnectionTimeout = 'SmtpConnectionTimeout';

/** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
*/
export const ValidationEntryStatus_SmtpConnectionFailure = 'SmtpConnectionFailure';

/** The mailbox for the e-mail address does not exist.
*/
export const ValidationEntryStatus_MailboxDoesNotExist = 'MailboxDoesNotExist';

/** A connection error occurred while validating the mailbox for the e-mail address.
*/
export const ValidationEntryStatus_MailboxConnectionFailure = 'MailboxConnectionFailure';

/** The external mail exchanger rejected the validation request.
*/
export const ValidationEntryStatus_LocalSenderAddressRejected = 'LocalSenderAddressRejected';

/** A timeout occured while verifying the existence of the mailbox.
*/
export const ValidationEntryStatus_MailboxValidationTimeout = 'MailboxValidationTimeout';

/** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
* (could be over quota; for example).
*/
export const ValidationEntryStatus_MailboxTemporarilyUnavailable = 'MailboxTemporarilyUnavailable';

/** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
 * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
 * protocol extensions.
*/
export const ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes = 'ServerDoesNotSupportInternationalMailboxes';

/** A timeout occured while verifying fake e-mail address rejection for the mail server.
*/
export const ValidationEntryStatus_CatchAllValidationTimeout = 'CatchAllValidationTimeout';

/** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
*/
export const ValidationEntryStatus_ServerIsCatchAll = 'ServerIsCatchAll';

/** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
*/
export const ValidationEntryStatus_CatchAllConnectionFailure = 'CatchAllConnectionFailure';

/** The mail exchanger responsible for the email address under test is temporarily unavailable.
*/
export const ValidationEntryStatus_ServerTemporaryUnavailable = 'ServerTemporaryUnavailable';

/** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
* caused the SMTP session to be aborted.
*/
export const ValidationEntryStatus_SmtpDialogError = 'SmtpDialogError';

/** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
* of its own policy rules.
*/
export const ValidationEntryStatus_LocalEndPointRejected = 'LocalEndPointRejected';

/** One or more unhandled exceptions have been thrown during the verification process and something went wrong
* on the Verifalia side.
*/
export const ValidationEntryStatus_UnhandledException = 'UnhandledException';

/** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
*/
export const ValidationEntryStatus_MailExchangerIsHoneypot = 'MailExchangerIsHoneypot';

/** The domain literal of the email address couldn't accept messages from the Internet. */
export const ValidationEntryStatus_UnacceptableDomainLiteral = 'UnacceptableDomainLiteral';

/** The item is a duplicate of another email address in the list.
* To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
* instance which exposes this status code</remarks>
*/
export const ValidationEntryStatus_Duplicate = 'Duplicate';

/**
 * The lowest possible processing priority (speed) for a validation job.
 */
export const ValidationPriority_Lowest = 0;

/**
 * Normal processing priority (speed) for a validation job.
 */
export const ValidationPriority_Normal = 127;

/**
 * The highest possible relative processing priority (speed) for a validation job.
 */
export const ValidationPriority_Highest = 255;