import { MultiplexedRestClient } from "../MultiplexedRestClient";

/* @if TARGET='node' */
import { RequestInit as NodeRequestInit } from "node-fetch"
/* @endif */

export interface Authenticator {
    decorateRequest(restClient: MultiplexedRestClient,
        requestInit:
            /* @if TARGET='node' */
            NodeRequestInit
            /* @endif */
            /* @if false */
            | // HACK: Make the IDE's background compiler happy
            /* @endif */
            /* @if TARGET='browser' */
            RequestInit
            /* @endif */
        ): Promise<void>;
}