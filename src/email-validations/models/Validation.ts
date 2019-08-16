import { ValidationOverview } from "./ValidationOverview";
import { ValidationEntry } from "./ValidationEntry";

/**
 * Represents a snapshot of an email validation job, along with its overview and eventual
 * validated entries.
 */
export interface Validation {
    /**
     * Overview information for this email validation job.
     */
    overview: ValidationOverview;

    /**
     * The eventual validated items for this email validation job.
     */
    entries: ValidationEntry[];
}


