import { VerifaliaError } from "./VerifaliaError";
/**
 * Thrown in the event all the Verifalia API endpoints are unreachable.
 */
export declare class ServiceUnreachableError extends VerifaliaError {
    readonly innerErrors: any[];
    /**
     *
     */
    constructor(innerErrors: any[]);
}
//# sourceMappingURL=ServiceUnreachableError.d.ts.map