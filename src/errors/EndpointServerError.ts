import { VerifaliaError } from "./VerifaliaError";

/**
 * Thrown in the rare event a Verifalia API endpoint returns an HTTP server error status code (HTTP 5xx).
 */
export class EndpointServerError extends VerifaliaError {
}