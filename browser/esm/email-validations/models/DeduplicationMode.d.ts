export declare const DeduplicationMode: {
    /**
     * Duplicates detection is turned off.
     */
    Off: string;
    /**
     * Identifies duplicates using an algorithm with safe rules-only, which guarantee no
     * false duplicates.
     */
    Safe: string;
    /**
     * Identifies duplicates using a set of relaxed rules which assume the target email
     * service providers are configured with modern settings only (instead of the broader
     * options the RFCs from the '80s allow).
     */
    Relaxed: string;
};
//# sourceMappingURL=DeduplicationMode.d.ts.map