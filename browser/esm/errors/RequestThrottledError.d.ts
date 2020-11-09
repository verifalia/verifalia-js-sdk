import { VerifaliaError } from "./VerifaliaError";
/**
 * Thrown in the event a request exceeded the maximum configured email validations rate or the maximum number
 * of concurrent requests from the same IP address.
 */
export declare class RequestThrottledError extends VerifaliaError {
    constructor();
}
//# sourceMappingURL=RequestThrottledError.d.ts.map