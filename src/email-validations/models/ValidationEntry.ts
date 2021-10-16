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
 * Represents a single validated entry within a validation.
 */
export interface ValidationEntry {
    /**
     * The index of this entry within its validation container. This property is mostly
     * useful in the event the API returns a filtered view of the items.
     */
    index: number;

    /**
     * The input string being validated.
     */
    inputData: string;
    
    /**
     * A custom, optional string which is passed back upon completing the validation. To pass
     * back and forth a custom value, use the custom property of ValidationRequestEntry.
     */
    custom?: string;

    /**
     * The date this entry has been completed, if available.
     */
    completedOn?: Date;

    /**
     * Gets the email address, without any eventual comment or folding white space.
     */
    emailAddress?: string;

    /**
     * Gets the domain part of the email address, converted to ASCII if needed and with comments
     * and folding white spaces stripped off. The ASCII encoding is performed using the standard
     * <a href="http://en.wikipedia.org/wiki/Punycode">punycode algorithm</a>. To get the domain part
     * without any ASCII encoding, use the emailAddressDomainPart property.
     */
    asciiEmailAddressDomainPart?: string;

    /**
     * Gets the local part of the email address, without comments and folding white spaces.
     */
    emailAddressLocalPart?: string;

    /**
     * Gets the domain part of the email address, without comments and folding white spaces.
     * If the ASCII-only (punycode) version of the domain part is needed, use the asciiEmailAddressDomainPart
     * property.
     */
    emailAddressDomainPart?: string;

    /**
     * If true, the email address has an international domain name.
     */
    hasInternationalDomainName?: boolean;

    /**
     * If true, the email address has an international mailbox name.
     */
    hasInternationalMailboxName?: boolean;

    /**
     * If true, the email address comes from a disposable email address (DEA) provider. See
     * <a href="https://verifalia.com/help/email-validations/what-is-a-disposable-email-address-dea"/>
     * for additional information about disposable email addresses.
     */
    isDisposableEmailAddress?: boolean;

    /**
     * If true, the email address comes from a free email address provider (e.g. gmail,
     * yahoo, outlook / hotmail, ...).
     */
    isFreeEmailAddress?: boolean;

    /**
     * If true, the local part of the email address is a well-known role account.
     */
    isRoleAccount?: boolean;

    /**
     * The validation status for this entry. See the constants exported in the
     * ValidationEntryStatus.ts file.
     */
    status?: string;

    /**
     * The classification for the status of this email address. Standard values include
     * Deliverable, Risky, Undeliverable and Unknown. See the constants exported in
     * the ValidationEntryClassification.ts file.
     */
    classification?: string;

    /**
     * The position of the character in the email address that eventually caused the syntax
     * validation to fail.
     */
    syntaxFailureIndex?: number;

    /**
     * The zero-based index of the first occurrence of this email address in the parent
     * validation, in the event the status for this entry is Duplicate; duplicated items do
     * not expose any result detail apart from this and the eventual custom values.
     */
    duplicateOf?: number;
}