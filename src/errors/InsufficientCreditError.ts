import { VerifaliaError } from "./VerifaliaError";

/**
 * Thrown when the credit of the requesting account is not enough to accept a given
 * email validation job.
 */
export class InsufficientCreditError extends VerifaliaError {
    constructor() {
        super(`The credit of the requesting account is too low to complete the operation.`);
    }
}