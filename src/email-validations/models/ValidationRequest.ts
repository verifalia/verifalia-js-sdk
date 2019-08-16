import { ValidationRequestEntry } from "./ValidationRequestEntry";
import { QualityLevelName } from "./QualityLevelName";
import { DeduplicationMode } from "./DeduplicationMode";
import { ValidationPriority } from "./ValidationPriority";

/**
 * Represents an email validation request to be submitted against the Verifalia API.
 */
export interface ValidationRequest {
    /**
     * One or more entry containing with the email addresses to validate, each along with
     * an optional custom state to be passed back upon completion.
     */
    entries: ValidationRequestEntry[];
    
    /**
     * A reference to the expected results quality level for this request. Quality levels
     * determine how Verifalia validates email addresses, including whether and how the
     * automatic reprocessing logic occurs (for transient statuses) and the verification
     * timeouts settings.
     * Use one of Standard, High or Extreme values or a custom quality level ID if you have
     * one (custom quality levels are available to premium plans only).
     */
    quality?: QualityLevelName;

    /**
     * The strategy Verifalia follows while determining which email addresses are duplicates,
     * within a multiple items job.
     * Duplicated items (after the first occurrence) will have the Duplicate status.
     */
    deduplication?: DeduplicationMode;

    /**
     * The eventual priority (speed) of the validation job, relative to the parent Verifalia account. In the event of an account
     * with many concurrent validation jobs, this value allows to increase the processing speed of a job with respect to the others.
     * The allowed range of values spans from 0 (lowest priority) to 255 (highest priority), where the midway value (127) means
     * normal priority; if not specified, Verifalia processes all the concurrent validation jobs for an account using the same
     * priority.
     */
    priority?: ValidationPriority;

    /**
     * An optional user-defined name for the validation job, for your own reference. The name
     * will be returned on subsequent API calls and shown on the Verifalia clients area.
     */
    name?: string;
}
