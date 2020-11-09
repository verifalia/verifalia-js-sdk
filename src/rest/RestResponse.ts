export interface RestResponse<T> {
    status: number;
    statusText: string;
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
    deserialize: () => Promise<T>;
}
