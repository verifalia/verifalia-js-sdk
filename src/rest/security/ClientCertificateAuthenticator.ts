/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2024 Cobisi Research
 * 
 * Cobisi Research
 * Via Della Costituzione, 31
 * 35010 Vigonza
 * Italy - European Union
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* @if TARGET='node' */

import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";
import { RequestInit as NodeRequestInit } from "node-fetch";
import { Agent } from "https";
import { KeyObject } from "tls";

/**
 * Allows to authenticate against the Verifalia API using an X.509 client certificate.
 * Learn more: https://verifalia.com/help/sub-accounts/what-is-x509-tls-client-certificate-authentication
 */
export class ClientCertificateAuthenticator implements Authenticator {
    private _agent: Agent;

    constructor(cert: string | Buffer | (string | Buffer)[], key: string | Buffer | (Buffer | KeyObject)[], passphrase?: string) {
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
        
        // This will always be invoked in a Node.js-only context

        (requestInit as NodeRequestInit).agent = this._agent;

        return Promise.resolve();
    }
}

/* @endif */