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
export declare const ValidationEntryStatus: {
    /** The email address has been successfully validated.
    */
    Success: string;
    /** A quoted pair within a quoted word is not closed properly.
    */
    UnmatchedQuotedPair: string;
    /** An unexpected quoted pair sequence has been found within a quoted word.
    */
    UnexpectedQuotedPairSequence: string;
    /** A new word boundary start has been detected at an invalid position.
    */
    InvalidWordBoundaryStart: string;
    /** An invalid character has been detected in the provided sequence.
    */
    InvalidCharacterInSequence: string;
    /** The number of parenthesis used to open comments is not equal to the one used to close them.
    */
    UnbalancedCommentParenthesis: string;
    /** An invalid sequence of two adjacent dots has been found.
    */
    DoubleDotSequence: string;
    /** The local part of the e-mail address has an invalid length.
    */
    InvalidLocalPartLength: string;
    /** An invalid folding white space (FWS) sequence has been found.
    */
    InvalidFoldingWhiteSpaceSequence: string;
    /** The at sign symbol (@); used to separate the local part from the domain part of the address; has not been found.
    */
    AtSignNotFound: string;
    /** An invalid quoted word with no content has been found.
    */
    InvalidEmptyQuotedWord: string;
    /** The email address has an invalid total length.
    */
    InvalidAddressLength: string;
    /** The domain part of the email address is not compliant with the IETF standards.
    */
    DomainPartCompliancyFailure: string;
    /** The email address is not compliant with the additional syntax rules of the email service provider
    * which should eventually manage it.
    */
    IspSpecificSyntaxFailure: string;
    /** The local part of the email address is a well-known role account. */
    LocalPartIsWellKnownRoleAccount: string;
    /** A timeout has occured while querying the DNS server(s) for records about the email address domain. */
    DnsQueryTimeout: string;
    /** Verification failed because of a socket connection error occured while querying the DNS server.
    */
    DnsConnectionFailure: string;
    /** The domain of the email address does not exist.
    */
    DomainDoesNotExist: string;
    /** The domain of the email address does not have any valid DNS record and couldn't accept messages from another
    * host on the Internet.
    */
    DomainIsMisconfigured: string;
    /** The domain has a NULL MX (RFC 7505) resource record and can't thus accept email messages.
     */
    DomainHasNullMx: string;
    /** The email address is provided by a well-known disposable email address provider (DEA).
    */
    DomainIsWellKnownDea: string;
    /** The mail exchanger being tested is a well-known disposable email address provider (DEA).
    */
    MailExchangerIsWellKnownDea: string;
    /** While both the domain and the mail exchanger for the email address being tested are not from a well-known
    * disposable email address provider (DEA); the mailbox is actually disposable.
    */
    MailboxIsDea: string;
    /** A timeout has occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionTimeout: string;
    /** A socket connection error occured while connecting to the mail exchanger which serves the email address domain.
    */
    SmtpConnectionFailure: string;
    /** The mailbox for the e-mail address does not exist.
    */
    MailboxDoesNotExist: string;
    /** A connection error occurred while validating the mailbox for the e-mail address.
    */
    MailboxConnectionFailure: string;
    /** The external mail exchanger rejected the validation request.
    */
    LocalSenderAddressRejected: string;
    /** A timeout occured while verifying the existence of the mailbox.
    */
    MailboxValidationTimeout: string;
    /** The requested mailbox is temporarily unavailable; it could be experiencing technical issues or some other transient problem
    * (could be over quota; for example).
    */
    MailboxTemporarilyUnavailable: string;
    /** The external mail exchanger does not support international mailbox names. To support this feature; mail exchangers must comply
     * with <a href="http://www.ietf.org/rfc/rfc5336.txt">RFC 5336</a> and support and announce both the 8BITMIME and the UTF8SMTP
     * protocol extensions.
    */
    ServerDoesNotSupportInternationalMailboxes: string;
    /** A timeout occured while verifying fake e-mail address rejection for the mail server.
    */
    CatchAllValidationTimeout: string;
    /** The external mail exchanger accepts fake; non existent; email addresses; therefore the provided email address MAY be nonexistent too.
    */
    ServerIsCatchAll: string;
    /** A connection error occurred while verifying the external mail exchanger rejects nonexistent email addresses.
    */
    CatchAllConnectionFailure: string;
    /** The mail exchanger responsible for the email address under test is temporarily unavailable.
    */
    ServerTemporaryUnavailable: string;
    /** The mail exchanger responsible for the email address under test replied one or more non-standard SMTP replies which
    * caused the SMTP session to be aborted.
    */
    SmtpDialogError: string;
    /** The external mail exchanger responsible for the email address under test rejected the local endpoint; probably because
    * of its own policy rules.
    */
    LocalEndPointRejected: string;
    /** One or more unhandled exceptions have been thrown during the verification process and something went wrong
    * on the Verifalia side.
    */
    UnhandledException: string;
    /** The mail exchanger responsible for the email address under test hides a honeypot / spam trap.
    */
    MailExchangerIsHoneypot: string;
    /** The domain literal of the email address couldn't accept messages from the Internet. */
    UnacceptableDomainLiteral: string;
    /** The item is a duplicate of another email address in the list.
    * To find out the entry this item is a duplicate of; check the duplicateOf property for the ValidationEntry
    * instance which exposes this status code</remarks>
    */
    Duplicate: string;
    /**
     * The mail exchanger responsible for the email address is parked / inactive.
     */
    MailExchangerIsParked: string;
};
//# sourceMappingURL=ValidationEntryStatus.d.ts.map