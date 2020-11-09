export interface ValidationRequestEntry {
    /**
     * The input string to validate, which should represent an email address.
     */
    inputData: string;
    /**
     * An optional, custom string which is passed back upon completing the validation job.
     * Setting this value is useful in the event you wish to have a custom reference of this entry with
     * with something else (for example, a record in your database). This value accepts a string with a
     * maximum length of 50 characters.
     */
    custom?: string;
}
//# sourceMappingURL=ValidationRequestEntry.d.ts.map