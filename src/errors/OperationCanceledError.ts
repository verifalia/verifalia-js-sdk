import { VerifaliaError } from "./VerifaliaError";

/**
 * Thrown whenever an async method is canceled.
 */
export class OperationCanceledError extends VerifaliaError {
    /**
     *
     */
    constructor() {
        super('The operation was canceled');
    }
}