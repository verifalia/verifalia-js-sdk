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

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Authenticator } from './security/Authenticator';
import { ServiceUnreachableError } from '../errors/ServiceUnreachableError';
import { EndPointServerError } from '../errors/EndPointServerError';
import { Logger } from '../diagnostics/Logger';
import { RequestThrottledError } from '../errors/RequestThrottledError';
import { InsufficientCreditError } from '../errors/InsufficientCreditError';
import { OperationCanceledError } from '../errors/OperationCanceledError';
import { CancellationToken } from '../common/CancellationToken';
import {
    MimeContentType_ApplicationJson,
    MimeContentType_ApplicationProblemJson,
    ProblemType_CaptchaValidationFailed
} from './constants';
import {RestRequest} from "./RestRequest";
import { RestResponse } from './RestResponse';
import {AuthenticationError} from "../errors/AuthenticationError";
import {CaptchaValidationError} from "../errors/CaptchaValidationError";
import {parseRestProblem} from "./functions";

/* @if TARGET='node' */
import AbortController from "abort-controller"
import FormData from "form-data"
import { RequestInit as NodeRequestInit, Response as NodeResponse } from "node-fetch"
import fetch from 'node-fetch';
/* @endif */

/* @if ENVIRONMENT!='production' */
const logger = new Logger('verifalia');
/* @endif */

export class MultiplexedRestClient {
    private _authenticator: Authenticator;
    private readonly _baseUris: string[];
    private readonly _userAgent: string | undefined;
    private _noOfInvocations: number;

    constructor(authenticator: Authenticator, baseUris: string[], userAgent: string | undefined = undefined) {
        if (!authenticator) throw new Error('authenticator is null');
        if (!baseUris || !baseUris.length) throw new Error('baseUris is null or empty');

        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
        this._noOfInvocations = 0;
    }

    public async invoke<T>(request: RestRequest,
        cancellationToken?: CancellationToken): Promise<RestResponse<T>> {
        const errors: any[] = [];
        const abortController = new AbortController()
        const onCanceled = () => abortController.abort();

        if (cancellationToken) {
            cancellationToken.register(onCanceled);
        }

        try {
            // We will attempt invoking the Verifalia API a maximum of once per endpoint

            for (let idxAttempt = 0; idxAttempt < this._baseUris.length; idxAttempt++) {
                const baseUri = this._baseUris[this._noOfInvocations++ % this._baseUris.length];

                let requestInit:
                    /* @if TARGET='node' */
                    NodeRequestInit
                    /* @endif */
                    /* @if false */
                    | // HACK: Make the IDE's background compiler happy
                    /* @endif */
                    /* @if TARGET='browser' */
                    RequestInit
                    /* @endif */
                    = {
                    method: request.method,
                    body: request.data && request.data instanceof FormData
                        ? request.data as any
                        : JSON.stringify(request.data),
                    redirect: 'manual',
                    headers: {
                        // Default accepted MIME content type
                        'Accept': `${MimeContentType_ApplicationJson}, ${MimeContentType_ApplicationProblemJson}`
                    }
                };

                // Cancellation support

                if (cancellationToken) {
                    requestInit.signal = abortController.signal;
                }

                // Adds the user-agent header only if it has been specified (can't be forced in the browser)

                if (this._userAgent) {
                    requestInit.headers = {
                        ...requestInit.headers,
                        'User-Agent': this._userAgent
                    };
                }

                if (request.method === 'POST' || request.method === 'PUT') {
                    requestInit.headers = {
                        ...requestInit.headers,
                        // Default posted MIME content type
                        'Content-Type': MimeContentType_ApplicationJson
                    };
                }

                requestInit = {
                    ...requestInit,
                    ...request.configOverride
                };

                if (!request.skipAuthentication) {
                    await this._authenticator.authenticate(this, requestInit, cancellationToken);
                }

                const queryString = request.params
                    ? Object
                        .entries(request.params)
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        .map(([key]) => `${key}=${encodeURIComponent(request.params[key])}`)
                        .join('&')
                    : null;

                const url = `${baseUri}${request.resource}${queryString ? '?' + queryString : ''}`;

                // Display outgoing requests to the API on the console (debug build only)

                /* @if ENVIRONMENT!='production' */
                logger.log('RequestInit', requestInit);
                logger.log('invoking URL', url);
                logger.log('params', JSON.stringify(request.params));
                logger.log('data', JSON.stringify(request.data));
                logger.log('headers', JSON.stringify(requestInit.headers));
                /* @endif */

                let response:
                    /* @if TARGET='node' */
                    NodeResponse
                    /* @endif */
                    /* @if false */
                    | // HACK: Make the IDE's background compiler happy
                    /* @endif */
                    /* @if TARGET='browser' */
                    Response
                    /* @endif */                
                    ;

                try {
                    response = await fetch(url, requestInit);
                }
                catch (error) {
                    if (error.name === 'AbortError') {
                        // The request has been canceled

                        throw new OperationCanceledError();
                    }

                    errors.push(error);
                    continue;
                }
                
                // Parse any eventual RFC-9457 problem

                const problem = await parseRestProblem(response);

                // Internal server error HTTP 5xx

                if (response.status >= 500 && response.status <= 599) {
                    errors.push(new EndPointServerError(response, problem));
                    continue;
                }

                // Authentication error

                if (response.status === 401) {
                    if (problem && problem.type === ProblemType_CaptchaValidationFailed) {
                        throw new CaptchaValidationError(response, problem);
                    }
                    else {
                        throw new AuthenticationError(response, problem);
                    }
                }
                
                // Authorization error

                if (response.status === 403) {
                    await this._authenticator.handleUnauthorizedRequest(this, response, problem, cancellationToken);
                }

                // Payment required

                if (response.status === 402) {
                    throw new InsufficientCreditError(response, problem);
                }

                // Throttling

                if (response.status === 429) {
                    throw new RequestThrottledError(response, problem);
                }

                return {
                    deserialize: async () => (await response.json()) as T,
                    response,
                    // Obsolete fields, for backward compatibility only
                    status: response.status,
                    statusText: response.statusText,
                    body: response.body,
                };
            }

            throw new ServiceUnreachableError(errors);
        }
        finally {
            if (cancellationToken) {
                cancellationToken.unregister(onCanceled);
            }
        }
    }
}