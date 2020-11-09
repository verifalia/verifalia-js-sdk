import { ValidationProgress } from "./ValidationProgress";
/**
 * Overview information for an email validation.
 */
export interface ValidationOverview {
    /**
     * The unique identifier for the validation job.
     */
    id: string;
    /**
     * The date and time this validation job has been submitted to Verifalia.
     */
    submittedOn: Date;
    /**
     * The date and time this validation job has been eventually completed.
     */
    completedOn?: Date;
    /**
     * The eventual priority (speed) of the validation job, relative to the parent Verifalia account. In the event of an account
     * with many concurrent validation jobs, this value allows to increase the processing speed of a job with respect to the others.
     * The allowed range of values spans from 0 (lowest priority) to 255 (highest priority), where the midway value (127) means
     * normal priority; if not specified, Verifalia processes all the concurrent validation jobs for an account using the same
     * priority.
     * See the constants exported in the ValidationPriority.ts file.
     */
    priority?: number;
    /**
     * An optional user-defined name for the validation job, for your own reference.
     */
    name: string;
    /**
     * The unique ID of the Verifalia user who submitted the validation job.
     */
    owner: string;
    /**
     * The IP address of the client which submitted the validation job.
     */
    clientIP: string;
    /**
     * The date and time the validation job was created.
     */
    createdOn: Date;
    /**
     * A reference to the results quality level this job was validated against. See the
     * constants exported in the QualityLevelName.ts file.
     */
    quality: string;
    /**
     * A deduplication option which affected the way Verifalia eventually marked entries as
     * duplicates upon processing. See the constants exported in the DeduplicationMode.ts file.
     */
    deduplication: string;
    /**
     * The maximum data retention period for this verification job, in the format [dd.]hh.mm.ss.
     */
    retention: string;
    /**
     * The processing status for the validation job. See the constants exported in the
     * ValidationStatus.ts file.
     */
    status: string;
    /**
     * The number of entries the validation job contains.
     */
    noOfEntries: number;
    /**
     * The eventual completion progress for the validation job.
     */
    progress?: ValidationProgress;
}
//# sourceMappingURL=ValidationOverview.d.ts.map