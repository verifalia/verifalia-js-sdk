/// <reference types="node" />
export interface RestResponse<T> {
    status: number;
    statusText: string;
    body: NodeJS.ReadableStream | // HACK: Keep the IDE's background compiler happy
    ReadableStream<Uint8Array> | null;
    deserialize: () => Promise<T>;
}
//# sourceMappingURL=RestResponse.d.ts.map