/**
 * A strategy Verifalia follows while determining which email addresses are duplicates,
 * within a multiple items validation. Duplicated items (after the first occurrence) will
 * have the Duplicate status.
 */
export enum DeduplicationMode {
    /**
     * Duplicates detection is turned off.
     */
    Off = 'Off',

    /**
     * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
     * false duplicates.
     */
    Safe = 'Safe',

    /**
     * Identifies duplicates using a set of relaxed rules which assume the target email
     * service providers are configured with modern settings only (instead of the broader
     * options the RFCs from the '80s allow).
     */
    Relaxed = 'Relaxed'
}
