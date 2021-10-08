/// <reference types="node" />
import { Response as NodeResponse } from "node-fetch";
export interface RestResponse<T> {
    deserialize: () => Promise<T>;
    response: NodeResponse | // HACK: Keep the IDE's background compiler happy
    Response;
    /** @deprecated */
    status: number;
    /** @deprecated */
    statusText: string;
    /** @deprecated */
    body: NodeJS.ReadableStream | // HACK: Keep the IDE's background compiler happy
    ReadableStream<Uint8Array> | null;
}
//# sourceMappingURL=RestResponse.d.ts.map