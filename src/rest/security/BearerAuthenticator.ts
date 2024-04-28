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

import {MultiplexedRestClient} from "../MultiplexedRestClient";
import {Authenticator} from "./Authenticator";
import {CancellationToken} from "../../common/CancellationToken";
import {AuthorizationError} from "../../errors/AuthorizationError";
import {RestProblem} from "../RestProblem";
import {TotpProvider} from "./TotpProvider";
import {AuthenticationError} from "../../errors/AuthenticationError";
import {parseRestProblem} from "../functions";
import {RestRequest} from "../RestRequest";

/* @if TARGET='node' */
import {RequestInit as NodeRequestInit, Response as NodeResponse} from "node-fetch"
/* @endif */

const JwtClaimMfaRequiredName = "verifalia:mfa";
const MaxNoOfMfaAttempts = 3;

interface BearerAuthenticationResponse {
    accessToken: string;
}

/**
 * Allows authentication against the Verifalia API using bearer authentication.
 */
export class BearerAuthenticator implements Authenticator {
    private readonly _username: string;
    private readonly _password: string;
    private readonly _totpProvider?: TotpProvider;
    private _accessToken?: string;

    constructor(username: string, password: string, totpProvider?: TotpProvider) {
        if (!username) {
            throw Error('username is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }

        if (!password) {
            throw Error('password is null or empty: please visit https://verifalia.com/client-area to set up a new user or a new browser app, if you don\'t have one.');
        }

        this._username = username;
        this._password = password;
        this._totpProvider = totpProvider;
    }

    public async authenticate(restClient: MultiplexedRestClient,
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
            ,
            cancellationToken?: CancellationToken
        ): Promise<void> {

        // Request a new security token to the Verifalia API, if one is not yet available
        
        if (!this._accessToken) {
            const authRequest = new RestRequest('POST',
                '/auth/tokens',
                undefined,
                {
                    username: this._username,
                    password: this._password
                });
            authRequest.skipAuthentication = true;
            
            const authResponse = await restClient.invoke(authRequest, cancellationToken);
            
            if (authResponse.response.status !== 200) {
                const problem = await parseRestProblem(authResponse.response);
                throw new AuthenticationError(authResponse.response, problem);                
            }
            
            let bearerAuthenticationResponse = await authResponse.deserialize() as BearerAuthenticationResponse;
            this._accessToken = bearerAuthenticationResponse.accessToken;

            /* eslint-disable */
            const jwt = this.parseJwt(this._accessToken);
            /* eslint-enable */
            const authFactors = jwt[JwtClaimMfaRequiredName] as [];
            
            if (authFactors) {
                bearerAuthenticationResponse = await this.provideAdditionalAuthFactor(restClient, authFactors, cancellationToken);
                this._accessToken = bearerAuthenticationResponse.accessToken;
            }
        }

        requestInit.headers = {
            ...requestInit.headers,
            'Authorization': `Bearer ${this._accessToken}`
        };
    }
    
    private provideAdditionalAuthFactor(restClient: MultiplexedRestClient, authFactors: [], cancellationToken?: CancellationToken): Promise<BearerAuthenticationResponse> {
        // We only support TOTP right now, but we may need to handle other factors in the future
        
        if (authFactors.find(factor => factor === 'totp')) {
            return this.provideTotpFactor(restClient, cancellationToken);
        }
        else {
            throw new Error(`No supported authentication factor was found among the advertised options: ${JSON.stringify(authFactors)}.`);
        }
    }

    private async provideTotpFactor(restClient: MultiplexedRestClient, cancellationToken?: CancellationToken): Promise<BearerAuthenticationResponse> {
        if (!this._totpProvider) {
            throw new Error('A multi-factor authentication is required but no token provider has been provided.');
        }

        for (let idxAttempt = 0; idxAttempt < MaxNoOfMfaAttempts; idxAttempt++)
        {
            cancellationToken?.throwIfCancellationRequested();

            // Retrieve the one-time token from the configured device

            const totp = await this._totpProvider
                .provideTotp(cancellationToken);

            // Validates the provided token against the Verifalia API

            const totpVerificationRequest = new RestRequest('POST',
                '/auth/totp/verifications',
                undefined,
                {
                    passCode: totp
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this._accessToken!}`
                    }
                });

            try {
                const totpVerificationResponse = await restClient.invoke(totpVerificationRequest, cancellationToken);

                if (totpVerificationResponse.response.ok) {
                    return await totpVerificationResponse.deserialize() as BearerAuthenticationResponse;
                }
            }
            catch (exception) {
                if (exception instanceof AuthorizationError) {
                    // Having an authorization issue is allowed here, as we are working on an TOTP token validation attempt.
                    // We will re-throw an AuthorizationException below in the even all the configured TOTP validation attempts fail. 
                }
                else {
                    throw exception;
                }
            }
        }

        throw new Error(`Invalid TOTP token provided after ${MaxNoOfMfaAttempts} attempt(s): aborting the authentication.`);
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

    private parseJwt(token: string): any {
        /* @if TARGET='node' */
        // Adapted from https://stackoverflow.com/a/38552302/904178
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        /* @endif */
        /* @if TARGET='browser' */
        // Adapted from https://stackoverflow.com/a/38552302/904178
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
        /* @endif */
        /* @if false */
        return null; // HACK: Make the IDE's background compiler happy
        /* @endif */
    }    
}