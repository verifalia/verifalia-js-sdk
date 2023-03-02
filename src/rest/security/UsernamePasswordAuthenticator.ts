/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2023 Cobisi Research
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

/* @if TARGET='node' */
import { RequestInit as NodeRequestInit } from "node-fetch";
/* @endif */

/**
 * Allows to authenticate against the Verifalia API using with either a username-password
 * credentials pair or with a browser app-key.
 */
export class UsernamePasswordAuthenticator implements Authenticator {
    private _username: string;
    private _password: string;

    constructor(username: string, password?: string) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }

        this._username = username;
        this._password = password || '';
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
}
