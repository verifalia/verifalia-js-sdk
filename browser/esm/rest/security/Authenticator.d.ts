import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { RequestInit as NodeRequestInit } from "node-fetch";
export interface Authenticator {
    decorateRequest(restClient: MultiplexedRestClient, requestInit: NodeRequestInit | // HACK: Make the IDE's background compiler happy
    RequestInit): Promise<void>;
}
//# sourceMappingURL=Authenticator.d.ts.map