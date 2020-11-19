import { VerifaliaError } from "./VerifaliaError";

/**
 * Thrown in the event all the Verifalia API endpoints are unreachable.
 */
export class ServiceUnreachableError extends VerifaliaError {
    public readonly innerErrors: any[];
    /**
     *
     */
    constructor(innerErrors: any[]) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        super(`All the base URIs are unreachable: ${innerErrors.map(error => `${error}`).join(', ')}`);

        this.innerErrors = innerErrors;
    }
}