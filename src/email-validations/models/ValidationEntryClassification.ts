/**
 * A classification of the status of a validation entry.
 */
export enum ValidationEntryClassification {
    /**
     * A validation entry marked as Deliverable refers to an email address which is deliverable.
     */
    Deliverable = 'Deliverable',

    /**
     * A validation entry marked as Risky refers to an email address which could be no longer valid.
     */
    Risky = 'Risky',

    /**
     * A validation entry marked as Undeliverable refers to an email address which is either invalid or
     * no longer deliverable.
     */
    Undeliverable = 'Undeliverable',

    /**
     * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
     */
    Unknown = 'Unknown'
}
