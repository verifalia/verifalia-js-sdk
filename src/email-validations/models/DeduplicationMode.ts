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
    Safe = 'Safe'
}
