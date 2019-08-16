export enum ValidationStatus {
    /**
     * Unknown status, due to a value reported by the API which is missing in this SDK.
     */
    Unknown,
    /**
     * The email validation job is being processed by Verifalia. The completion progress, if any, is available
     * through the progress property
     */
    InProgress = 'InProgress',
    /**
     * The email validation job has been completed and its results are available.
     */
    Completed = 'Completed',
    /**
     * The email validation job has either been deleted.
     */
    Deleted = 'Deleted',
    /**
     * The email validation job is expired.
     */
    Expired = 'Expired'
}
