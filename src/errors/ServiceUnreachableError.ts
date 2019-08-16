import { VerifaliaError } from "./VerifaliaError";

export class ServiceUnreachableError extends VerifaliaError {
    public readonly innerErrors: any[];
    /**
     *
     */
    constructor(innerErrors: any[]) {
        super(`All the base URIs are unreachable: ${innerErrors.map(error => error).join(', ')}`);

        this.innerErrors = innerErrors;
    }
}