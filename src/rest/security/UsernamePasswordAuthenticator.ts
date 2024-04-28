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

import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";
import {CancellationToken} from "../../common/CancellationToken";
import {AuthorizationError} from "../../errors/AuthorizationError";
import {RestProblem} from "../RestProblem";

/* @if TARGET='node' */
import {RequestInit as NodeRequestInit, Response as NodeResponse} from "node-fetch"
/* @endif */

/**
 * Allows authentication against the Verifalia API using either a username-password credentials pair or a browser app-key.
 */
export class UsernamePasswordAuthenticator implements Authenticator {
    private readonly _username: string;
    private readonly _password: string;

    constructor(username: string, password?: string) {
        if (!username) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }

        this._username = username;
        this._password = password || '';
    }

    public authenticate(restClient: MultiplexedRestClient, requestInit:
            /* @if TARGET='node' */
            NodeRequestInit
            /* @endif */
            /* @if false */
            | // HACK: Make the IDE's background compiler happy
            /* @endif */
            /* @if TARGET='browser' */
            RequestInit
            /* @endif */
            ,
            cancellationToken?: CancellationToken
        ): Promise<void> {

        requestInit.headers = {
            ...requestInit.headers,
            'Authorization': 'Basic ' +
                /* @if TARGET='node' */
                Buffer.from(this._username + ":" + this._password).toString('base64')
                /* @endif */
                /* @if false */
                // HACK: Keep the IDE's background compiler happy
                +
                /* @endif */
                /* @if TARGET='browser' */
                btoa(this._username + ":" + this._password)
                /* @endif */
        };

        return Promise.resolve();
    }

    public handleUnauthorizedRequest(restClient: MultiplexedRestClient,
        response:
             /* @if TARGET='node' */
             NodeResponse
             /* @endif */
             /* @if false */
             | // HACK: Make the IDE's background compiler happy
             /* @endif */
             /* @if TARGET='browser' */
             Response
            /* @endif */
        ,
        problem?: RestProblem,
        cancellationToken?: CancellationToken): Promise<void> {

        throw new AuthorizationError(response, problem);
    }
}
