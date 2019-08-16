/**
 * A reference to a Verifalia quality level. Quality levels determine how Verifalia validates
 * email addresses, including whether and how the automatic reprocessing logic occurs (for
 * transient statuses) and the verification timeouts settings.
 */
export enum QualityLevelName {
    /**
     * The Standard quality level. Suitable for most businesses, provides good results for the
     * vast majority of email addresses; features a single validation pass and 5 second anti-tarpit
     * time; less suitable for validating email addresses with temporary issues (mailbox over
     * quota, greylisting, etc.) and slower mail exchangers.
     */
    Standard = 'Standard',

    /**
     * The High quality level. Much higher quality, featuring 3 validation passes and 50 seconds
     * of anti-tarpit time, so you can even validate most addresses with temporary issues, or
     * slower mail exchangers.
     */
    High = 'High',

    /**
     * The Extreme quality level. Unbeatable, top-notch quality for professionals who need the best
     * results the industry can offer: performs email validations at the highest level, with 9
     * validation passes and 2 minutes of anti-tarpit time.
     */
    Extreme = 'Extreme'
}
