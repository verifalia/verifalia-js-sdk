import { VerifaliaError } from "./VerifaliaError";

/**
 * Thrown in the event a request exceeded the maximum configured email validations rate or the maximum number
 * of concurrent requests from the same IP address.
 */
export class RequestThrottledError extends VerifaliaError {
    constructor() {
        super(`The current request has been throttled; please try again later.`);
    }
}