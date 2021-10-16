/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2021 Cobisi Research
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
import { EndpointServerError } from '../errors/EndpointServerError';
import { AuthorizationError } from '../errors/AuthorizationError';
import { Logger } from '../diagnostics/Logger';
import { RequestThrottledError } from '../errors/RequestThrottledError';
import { InsufficientCreditError } from '../errors/InsufficientCreditError';
import { OperationCanceledError } from '../errors/OperationCanceledError';
import { CancellationToken } from '../common/CancellationToken';
import { MimeContentType_ApplicationJson } from './constants';
import { RestResponse } from './RestResponse';

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
    private _baseUris: string[];
    private _userAgent: string | undefined;
    private _noOfInvocations: number;

    constructor(authenticator: Authenticator, baseUris: string[], userAgent: string | undefined = undefined) {
        if (!authenticator) throw new Error('authenticator is null');
        if (!baseUris || !baseUris.length) throw new Error('baseUris is null or empty');

        this._authenticator = authenticator;
        this._userAgent = userAgent;
        this._baseUris = baseUris;
        this._noOfInvocations = 0;
    }

    public async invoke<T>(method: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'DELETE',
        resource: string,
        params?: any,
        data?: any,
        configOverride?: any,
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
                    method,
                    body: data && data instanceof FormData
                        ? data as any
                        : JSON.stringify(data),
                    redirect: 'manual',
                    headers: {
                        // Default accepted MIME content type
                        'Accept': MimeContentType_ApplicationJson
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

                if (method === 'POST' || method === 'PUT') {
                    requestInit.headers = {
                        ...requestInit.headers,
                        // Default posted MIME content type
                        'Content-Type': MimeContentType_ApplicationJson
                    };
                }

                requestInit = {
                    ...requestInit,
                    ...configOverride
                };

                await this._authenticator.decorateRequest(this, requestInit);

                const queryString = params
                    ? Object
                        .entries(params)
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        .map(([key]) => `${key}=${encodeURIComponent(params[key])}`)
                        .join('&')
                    : null;

                const url = `${baseUri}${resource}${queryString ? '?' + queryString : ''}`;

                // Display outgoing requests to the API on the console (debug build only)

                /* @if ENVIRONMENT!='production' */
                logger.log('RequestInit', requestInit);
                logger.log('invoking URL', url);
                logger.log('params', JSON.stringify(params));
                logger.log('data', JSON.stringify(data));
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
                    response = await fetch(url,
                        requestInit);
                }
                catch (error) {
                    if (error.name === 'AbortError') {
                        // The request has been canceled

                        throw new OperationCanceledError();
                    }

                    errors.push(error);
                    continue;
                }

                // Internal server error HTTP 5xx

                if (response.status >= 500 && response.status <= 599) {
                    errors.push(new EndpointServerError(`Endpoint ${baseUri} returned an HTTP ${response.status} status code.`));
                    continue;
                }

                // Authentication / authorization error

                if (response.status === 401 || response.status === 403) {
                    throw new AuthorizationError(response.statusText + (await response.text()) + ' ' + url);
                }

                // Payment required

                if (response.status === 402) {
                    throw new InsufficientCreditError();
                }

                // Throttling

                if (response.status === 429) {
                    throw new RequestThrottledError();
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