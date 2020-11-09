/**
 * Progress details for a validation overview, exposed by way of the progress property.
 */
export interface ValidationProgress {
    /**
     * The percentage of completed entries, ranging from 0 to 1.
     */
    percentage: number;
    /**
     * An eventual estimated required time span needed to complete the whole job, expressed in [d.]hh:mm:ss format.
     */
    estimatedTimeRemaining?: string;
}
//# sourceMappingURL=ValidationProgress.d.ts.map