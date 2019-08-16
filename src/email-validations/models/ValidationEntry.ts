import { ValidationEntryStatus } from "./ValidationEntryStatus";
import { ValidationEntryClassification } from "./ValidationEntryClassification";

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
     * The validation status for this entry.
     */
    status?: ValidationEntryStatus;

    /**
     * The classification for the status of this email address. Standard values include
     * Deliverable, Risky, Undeliverable and Unknown.
     */
    classification?: ValidationEntryClassification;

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