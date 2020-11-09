import {
    DeduplicationMode_Off,
    DeduplicationMode_Relaxed,
    DeduplicationMode_Safe
} from "../constants";

export const DeduplicationMode = {
    /**
     * Duplicates detection is turned off.
     */
    Off: DeduplicationMode_Off,

    /**
     * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
     * false duplicates.
     */
    Safe: DeduplicationMode_Safe,

    /**
     * Identifies duplicates using a set of relaxed rules which assume the target email
     * service providers are configured with modern settings only (instead of the broader
     * options the RFCs from the '80s allow).
     */
    Relaxed: DeduplicationMode_Relaxed
}