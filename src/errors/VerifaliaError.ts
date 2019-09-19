/**
 * Base error class for exceptions thrown by the Verifalia SDK for JavaScript.
 */
export class VerifaliaError {
    message?: string;

    constructor(message?: string) {
        this.message = message;
    }

    public toString = () : string => {
        return this.message || '[Error]';
    }    
}
