/**
 * Provides enumerated values for the supported validation statuses for a ValidationEntry.
 */
export enum ValidationEntryStatus {
    /** The email address has been successfully validated.
    */
    Success = 'Success',

    /** A quoted pair within a quoted word is not closed properly.
    */
    UnmatchedQuotedPair = 'UnmatchedQuotedPair',

    /** An unexpected quoted pair sequence has been found within a quoted word.
    */
    UnexpectedQuotedPairSequence = 'UnexpectedQuotedPairSequence',

    /** A new word boundary start has been detected at an invalid position.
    */
    InvalidWordBoundaryStart = 'InvalidWordBoundaryStart',

    /** An invalid character has been detected in the provided sequence.
    */
    InvalidCharacterInSequence = 'InvalidCharacterInSequence',

    /** The number of parenthesis used to open comments is not equal to the one used to close them.
    */
    UnbalancedCommentParenthesis = 'UnbalancedCommentParenthesis',

    /** An invalid sequence of two adjacent dots has been found.
    */
    DoubleDotSequence = 'DoubleDotSequence',

    /** The local part of the e-mail address has an invalid length.
    */
    InvalidLocalPartLength = 'InvalidLocalPartLength',

    /** An invalid folding white space (FWS) sequence has been found.
    */
    InvalidFoldingWhiteSpaceSequence = 'InvalidFoldingWhiteSpaceSequence',

    /** The at sign symbol (@), used to separate the local part from the domain part of the address, has not been found.
    */
    AtSignNotFound = 'AtSignNotFound',

    /** An invalid quoted word with no content has been found.
    */
    InvalidEmptyQuotedWord = 'InvalidEmptyQuotedWord',

    /** The email address has an invalid total length.
    */
    InvalidAddressLength = 'InvalidAddressLength',

    /** The domain part of the email address is not compliant with the IETF standards.
    */
    DomainPartCompliancyFailure = 'DomainPartCompliancyFailure',

    /** The email address is not compliant with the additional syntax rules of the email service provider
    * which should eventually manage it.
    */
    IspSpecificSyntaxFailure = 'IspSpecificSyntaxFailure',

    /** The local part of the email address is a well-known role account. */
    LocalPartIsWellKnownRoleAccount = 'LocalPartIsWellKnownRoleAccount,',

    /** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
    DnsQueryTimeout = 'DnsQueryTimeout',

    /** Verification failed because of a socket connection error occured while querying the DNS server.
    */
    DnsConnectionFailure = 'DnsConnectionFailure',

    /** The domain of the email address does not exist.
    */
    DomainDoesNotExist = 'DomainDoesNotExist',

    /** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
    * host on the Internet.
    */
    DomainIsMisconfigured = 'DomainIsMisconfigured',

    /** The email address is provided by a well-known disposable email address provider (DEA).
    */
    DomainIsWellKnownDea = 'DomainIsWellKnownDea',

    /** The mail exchanger being tested is a well-known disposable email address provider (DEA).
    */
    MailExchangerIsWellKnownDea = 'MailExchangerIsWellKnownDea',

    /** While both the domain and the mail exchanger for the email address being tested are not from a well-known
    * disposable email address provider (DEA), the mailbox is actually disposable.
    */
    MailboxIsDea = 'MailboxIsDea',

    /** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionTimeout = 'SmtpConnectionTimeout',

    /** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionFailure = 'SmtpConnectionFailure',

    /** The mailbox for the e-mail address does not exist.
    */
    MailboxDoesNotExist = 'MailboxDoesNotExist',

    /** A connection error occurred while validating the mailbox for the e-mail address.
    */
    MailboxConnectionFailure = 'MailboxConnectionFailure',

    /** The external mail exchanger rejected the validation request.
    */
    LocalSenderAddressRejected = 'LocalSenderAddressRejected',

    /** A timeout occured while verifying the existence of the mailbox.
    */
    MailboxValidationTimeout = 'MailboxValidationTimeout',

    /** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
    * (could be over quota, for example).
    */
    MailboxTemporarilyUnavailable = 'MailboxTemporarilyUnavailable',

    /** The external mail exchanger does not support international mailbox names. To support this feature, mail exchangers must comply
     * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
     * protocol extensions.
    */
    ServerDoesNotSupportInternationalMailboxes = 'ServerDoesNotSupportInternationalMailboxes',

    /** A timeout occured while verifying fake e-mail address rejection for the mail server.
    */
    CatchAllValidationTimeout = 'CatchAllValidationTimeout',

    /** The external mail exchanger accepts fake, non existent, email addresses; therefore the provided email address MAY be nonexistent too.
    */
    ServerIsCatchAll = 'ServerIsCatchAll',

    /** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
    */
    CatchAllConnectionFailure = 'CatchAllConnectionFailure',

    /** The mail exchanger responsible for the email address under test is temporarily unavailable.
    */
    ServerTemporaryUnavailable = 'ServerTemporaryUnavailable',

    /** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
    * caused the SMTP session to be aborted.
    */
    SmtpDialogError = 'SmtpDialogError',

    /** The external mail exchanger responsible for the email address under test rejected the local endpoint, probably because
    * of its own policy rules.
    */
    LocalEndPointRejected = 'LocalEndPointRejected',

    /** One or more unhandled exceptions have been thrown during the verification process and something went wrong
    * on the Verifalia side.
    */
    UnhandledException = 'UnhandledException',

    /** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
    */
    MailExchangerIsHoneypot = 'MailExchangerIsHoneypot',

    /** The domain literal of the email address couldn't accept messages from the Internet. */
    UnacceptableDomainLiteral = 'UnacceptableDomainLiteral',

    /** The item is a duplicate of another email address in the list.
    * To find out the entry this item is a duplicate of, check the duplicateOf property for the ValidationEntry
    * instance which exposes this status code</remarks>
    */
    Duplicate = 'Duplicate'
}
