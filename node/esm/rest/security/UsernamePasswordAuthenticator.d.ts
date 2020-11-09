import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";
import { RequestInit as NodeRequestInit } from "node-fetch";
export declare class UsernamePasswordAuthenticator implements Authenticator {
    private _username;
    private _password;
    constructor(username: string, password: string);
    decorateRequest(restClient: MultiplexedRestClient, requestInit: NodeRequestInit): Promise<void>;
}
//# sourceMappingURL=UsernamePasswordAuthenticator.d.ts.map