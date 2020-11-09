import {
    ValidationEntryClassification_Deliverable,
    ValidationEntryClassification_Risky,
    ValidationEntryClassification_Undeliverable,
    ValidationEntryClassification_Unknown
} from "../constants";

export const ValidationEntryClassification = {
    /**
     * A validation entry marked as Deliverable refers to an email address which is deliverable.
     */
    Deliverable: ValidationEntryClassification_Deliverable,

    /**
     * A validation entry marked as Risky refers to an email address which could be no longer valid.
     */
    Risky: ValidationEntryClassification_Risky,

    /**
     * A validation entry marked as Undeliverable refers to an email address which is either invalid or
     * no longer deliverable.
     */
    Undeliverable: ValidationEntryClassification_Undeliverable,

    /**
     * A validation entry marked as Unknown contains an email address whose deliverability is unknown.
     */
    Unknown: ValidationEntryClassification_Unknown
};
