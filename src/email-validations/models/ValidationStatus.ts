import {
    ValidationStatus_Completed,
    ValidationStatus_Deleted,
    ValidationStatus_Expired,
    ValidationStatus_InProgress
} from "../constants";

export const ValidationStatus = {
    /**
     * The email validation job is being processed by Verifalia. The completion progress, if any, is available
     * through the progress property
     */
    InProgress: ValidationStatus_InProgress,
    /**
     * The email validation job has been completed and its results are available.
     */
    Completed: ValidationStatus_Completed,
    /**
     * The email validation job has either been deleted.
     */
    Deleted: ValidationStatus_Deleted,
    /**
     * The email validation job is expired.
     */
    Expired: ValidationStatus_Expired
}