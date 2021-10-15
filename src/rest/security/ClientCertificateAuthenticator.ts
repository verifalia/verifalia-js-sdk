/* @if TARGET='node' */

import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";
import { RequestInit as NodeRequestInit } from "node-fetch";
import { Agent } from "https";
import { KeyObject } from "tls";

export class ClientCertificateAuthenticator implements Authenticator {
    private _agent: Agent;

    constructor(cert: string | Buffer | (string | Buffer)[], key: string | Buffer | (Buffer | KeyObject)[], passphrase: string) {
        if (!cert) {
            throw Error('Invalid client certificate chain.');
        }

        this._agent = new Agent({
            cert,
            key,
            passphrase
        });
    }

    public decorateRequest(restClient: MultiplexedRestClient, requestInit:
            /* @if TARGET='node' */
            NodeRequestInit
            /* @endif */
            /* @if false */
            | // HACK: Make the IDE's background compiler happy
            /* @endif */
            /* @if TARGET='browser' */
            RequestInit
            /* @endif */
        ): Promise<void> {

        (requestInit as NodeRequestInit).agent = this._agent;

        return Promise.resolve();
    }
}

/* @endif */