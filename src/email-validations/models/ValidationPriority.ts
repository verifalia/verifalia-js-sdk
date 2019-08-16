/**
 * The priority (speed) of a validation job, relative to the parent Verifalia account. In the event
 * of an account with many concurrent validation jobs, this value allows to increase the processing
 * speed of a job with respect to the others. The allowed range of values spans from Lowest (0 -
 * lowest priority) to Highest (255 - highest priority), where the midway value Normal (127) means
 * normal priority; if not specified, Verifalia processes all the concurrent validation jobs for an
 * account using the same speed.
 */
export enum ValidationPriority {
    /**
     * The lowest possible processing priority (speed) for a validation job.
     */
    Lowest = 0,

    /**
     * Normal processing priority (speed) for a validation job.
     */
    Normal = 127,

    /**
     * The highest possible relative processing priority (speed) for a validation job.
     */
    Highest = 255
}
