import { ValidationRequestEntry } from "./ValidationRequestEntry";
import { ValidationSettings } from "./ValidationSettings";

/**
 * Represents an email validation request to be submitted against the Verifalia API.
 */
export interface ValidationRequest extends ValidationSettings {
    /**
     * One or more entry containing with the email addresses to validate, each along with
     * an optional custom state to be passed back upon completion.
     */
    entries: ValidationRequestEntry[];
}