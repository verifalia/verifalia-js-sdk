import {
    ValidationEntryStatus_AtSignNotFound,
    ValidationEntryStatus_CatchAllConnectionFailure,
    ValidationEntryStatus_CatchAllValidationTimeout,
    ValidationEntryStatus_DnsConnectionFailure,
    ValidationEntryStatus_DnsQueryTimeout,
    ValidationEntryStatus_DomainDoesNotExist,
    ValidationEntryStatus_DomainHasNullMx,
    ValidationEntryStatus_DomainIsMisconfigured,
    ValidationEntryStatus_DomainIsWellKnownDea,
    ValidationEntryStatus_DomainPartCompliancyFailure,
    ValidationEntryStatus_DoubleDotSequence,
    ValidationEntryStatus_Duplicate,
    ValidationEntryStatus_InvalidAddressLength,
    ValidationEntryStatus_InvalidCharacterInSequence,
    ValidationEntryStatus_InvalidEmptyQuotedWord,
    ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence,
    ValidationEntryStatus_InvalidLocalPartLength,
    ValidationEntryStatus_InvalidWordBoundaryStart,
    ValidationEntryStatus_IspSpecificSyntaxFailure,
    ValidationEntryStatus_LocalEndPointRejected,
    ValidationEntryStatus_LocalPartIsWellKnownRoleAccount,
    ValidationEntryStatus_LocalSenderAddressRejected,
    ValidationEntryStatus_MailboxConnectionFailure,
    ValidationEntryStatus_MailboxDoesNotExist,
    ValidationEntryStatus_MailboxIsDea,
    ValidationEntryStatus_MailboxTemporarilyUnavailable,
    ValidationEntryStatus_MailboxValidationTimeout,
    ValidationEntryStatus_MailExchangerIsHoneypot,
    ValidationEntryStatus_MailExchangerIsWellKnownDea,
    ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes,
    ValidationEntryStatus_ServerIsCatchAll,
    ValidationEntryStatus_ServerTemporaryUnavailable,
    ValidationEntryStatus_SmtpConnectionFailure,
    ValidationEntryStatus_SmtpConnectionTimeout,
    ValidationEntryStatus_SmtpDialogError,
    ValidationEntryStatus_Success,
    ValidationEntryStatus_UnacceptableDomainLiteral,
    ValidationEntryStatus_UnbalancedCommentParenthesis,
    ValidationEntryStatus_UnexpectedQuotedPairSequence,
    ValidationEntryStatus_UnhandledException,
    ValidationEntryStatus_UnmatchedQuotedPair
} from "../constants";

export const ValidationEntryStatus = {
    /** The email address has been successfully validated.
    */
    Success: ValidationEntryStatus_Success,

    /** A quoted pair within a quoted word is not closed properly.
    */
    UnmatchedQuotedPair: ValidationEntryStatus_UnmatchedQuotedPair,

    /** An unexpected quoted pair sequence has been found within a quoted word.
    */
    UnexpectedQuotedPairSequence: ValidationEntryStatus_UnexpectedQuotedPairSequence,

    /** A new word boundary start has been detected at an invalid position.
    */
    InvalidWordBoundaryStart: ValidationEntryStatus_InvalidWordBoundaryStart,

    /** An invalid character has been detected in the provided sequence.
    */
    InvalidCharacterInSequence: ValidationEntryStatus_InvalidCharacterInSequence,

    /** The number of parenthesis used to open comments is not equal to the one used to close them.
    */
    UnbalancedCommentParenthesis: ValidationEntryStatus_UnbalancedCommentParenthesis,

    /** An invalid sequence of two adjacent dots has been found.
    */
    DoubleDotSequence: ValidationEntryStatus_DoubleDotSequence,

    /** The local part of the e-mail address has an invalid length.
    */
    InvalidLocalPartLength: ValidationEntryStatus_InvalidLocalPartLength,

    /** An invalid folding white space (FWS) sequence has been found.
    */
    InvalidFoldingWhiteSpaceSequence: ValidationEntryStatus_InvalidFoldingWhiteSpaceSequence,

    /** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
    */
    AtSignNotFound: ValidationEntryStatus_AtSignNotFound,

    /** An invalid quoted word with no content has been found.
    */
    InvalidEmptyQuotedWord: ValidationEntryStatus_InvalidEmptyQuotedWord,

    /** The email address has an invalid total length.
    */
    InvalidAddressLength: ValidationEntryStatus_InvalidAddressLength,

    /** The domain part of the email address is not compliant with the IETF standards.
    */
    DomainPartCompliancyFailure: ValidationEntryStatus_DomainPartCompliancyFailure,

    /** The email address is not compliant with the additional syntax rules of the email service provider
    * which should eventually manage it.
    */
    IspSpecificSyntaxFailure: ValidationEntryStatus_IspSpecificSyntaxFailure,

    /** The local part of the email address is a well-known role account. */
    LocalPartIsWellKnownRoleAccount: ValidationEntryStatus_LocalPartIsWellKnownRoleAccount,

    /** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
    DnsQueryTimeout: ValidationEntryStatus_DnsQueryTimeout,

    /** Verification failed because of a socket connection error occured while querying the DNS server.
    */
    DnsConnectionFailure: ValidationEntryStatus_DnsConnectionFailure,

    /** The domain of the email address does not exist.
    */
    DomainDoesNotExist: ValidationEntryStatus_DomainDoesNotExist,

    /** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
    * host on the Internet.
    */
    DomainIsMisconfigured: ValidationEntryStatus_DomainIsMisconfigured,

    /** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
     */
    DomainHasNullMx: ValidationEntryStatus_DomainHasNullMx,

    /** The email address is provided by a well-known disposable email address provider (DEA).
    */
    DomainIsWellKnownDea: ValidationEntryStatus_DomainIsWellKnownDea,

    /** The mail exchanger being tested is a well-known disposable email address provider (DEA).
    */
    MailExchangerIsWellKnownDea: ValidationEntryStatus_MailExchangerIsWellKnownDea,

    /** While both the domain and the mail exchanger for the email address being tested are not from a well-known
    * disposable email address provider (DEA); the mailbox is actually disposable.
    */
    MailboxIsDea: ValidationEntryStatus_MailboxIsDea,

    /** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionTimeout: ValidationEntryStatus_SmtpConnectionTimeout,

    /** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionFailure: ValidationEntryStatus_SmtpConnectionFailure,

    /** The mailbox for the e-mail address does not exist.
    */
    MailboxDoesNotExist: ValidationEntryStatus_MailboxDoesNotExist,

    /** A connection error occurred while validating the mailbox for the e-mail address.
    */
    MailboxConnectionFailure: ValidationEntryStatus_MailboxConnectionFailure,

    /** The external mail exchanger rejected the validation request.
    */
    LocalSenderAddressRejected: ValidationEntryStatus_LocalSenderAddressRejected,

    /** A timeout occured while verifying the existence of the mailbox.
    */
    MailboxValidationTimeout: ValidationEntryStatus_MailboxValidationTimeout,

    /** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
    * (could be over quota; for example).
    */
    MailboxTemporarilyUnavailable: ValidationEntryStatus_MailboxTemporarilyUnavailable,

    /** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
     * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
     * protocol extensions.
    */
    ServerDoesNotSupportInternationalMailboxes: ValidationEntryStatus_ServerDoesNotSupportInternationalMailboxes,

    /** A timeout occured while verifying fake e-mail address rejection for the mail server.
    */
    CatchAllValidationTimeout: ValidationEntryStatus_CatchAllValidationTimeout,

    /** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
    */
    ServerIsCatchAll: ValidationEntryStatus_ServerIsCatchAll,

    /** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
    */
    CatchAllConnectionFailure: ValidationEntryStatus_CatchAllConnectionFailure,

    /** The mail exchanger responsible for the email address under test is temporarily unavailable.
    */
    ServerTemporaryUnavailable: ValidationEntryStatus_ServerTemporaryUnavailable,

    /** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
    * caused the SMTP session to be aborted.
    */
    SmtpDialogError: ValidationEntryStatus_SmtpDialogError,

    /** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
    * of its own policy rules.
    */
    LocalEndPointRejected: ValidationEntryStatus_LocalEndPointRejected,

    /** One or more unhandled exceptions have been thrown during the verification process and something went wrong
    * on the Verifalia side.
    */
    UnhandledException: ValidationEntryStatus_UnhandledException,

    /** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
    */
    MailExchangerIsHoneypot: ValidationEntryStatus_MailExchangerIsHoneypot,

    /** The domain literal of the email address couldn't accept messages from the Internet. */
    UnacceptableDomainLiteral: ValidationEntryStatus_UnacceptableDomainLiteral,

    /** The item is a duplicate of another email address in the list.
    * To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
    * instance which exposes this status code</remarks>
    */
    Duplicate: ValidationEntryStatus_Duplicate
}