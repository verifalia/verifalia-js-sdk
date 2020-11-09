import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";
export declare class UsernamePasswordAuthenticator implements Authenticator {
    private _username;
    private _password;
    constructor(username: string, password: string);
    decorateRequest(restClient: MultiplexedRestClient, requestInit: RequestInit): Promise<void>;
}
//# sourceMappingURL=UsernamePasswordAuthenticator.d.ts.map