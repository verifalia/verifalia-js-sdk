import {
    ValidationPriority_Highest,
    ValidationPriority_Lowest,
    ValidationPriority_Normal
} from "../constants";

export const ValidationPriority = {
    /**
     * The lowest possible processing priority (speed) for a validation job.
     */
    Lowest: ValidationPriority_Lowest,

    /**
     * Normal processing priority (speed) for a validation job.
     */
    Normal: ValidationPriority_Normal,

    /**
     * The highest possible relative processing priority (speed) for a validation job.
     */
    Highest: ValidationPriority_Highest
}