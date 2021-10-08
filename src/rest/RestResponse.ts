import { Response as NodeResponse } from "node-fetch";

export interface RestResponse<T> {
    deserialize: () => Promise<T>;
    response:
        /* @if TARGET='node' */
        NodeResponse
        /* @endif */
        /* @if false */
        | // HACK: Keep the IDE's background compiler happy
        /* @endif */
        /* @if TARGET='browser' */
        Response
        /* @endif */
    ;

    // Deprecated fields, left for backward compatibility

    /** @deprecated */
    status: number;
    /** @deprecated */
    statusText: string;
    /** @deprecated */
    body:
        /* @if TARGET='node' */
        NodeJS.ReadableStream
        /* @endif */
        /* @if false */
        | // HACK: Keep the IDE's background compiler happy
        /* @endif */
        /* @if TARGET='browser' */
        ReadableStream<Uint8Array> | null
        /* @endif */
    ;
}