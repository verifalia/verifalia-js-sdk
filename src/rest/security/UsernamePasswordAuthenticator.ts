import { MultiplexedRestClient } from "../MultiplexedRestClient";
import { Authenticator } from "./Authenticator";

/* @if TARGET='node' */
import { RequestInit as NodeRequestInit } from "node-fetch";
/* @endif */

export class UsernamePasswordAuthenticator implements Authenticator {
    private _username: string;
    private _password: string;

    constructor(username: string, password: string) {
        if (!username && username.length === 0) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }

        this._username = username;
        this._password = password;
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
