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
import { CancellationToken } from "../../common/CancellationToken";
import { RestProblem } from "../RestProblem";
import { TotpProvider } from "./TotpProvider";
import { RequestInit as NodeRequestInit, Response as NodeResponse } from "node-fetch";
/**
 * Allows authentication against the Verifalia API using bearer authentication.
 */
export declare class BearerAuthenticator implements Authenticator {
    private readonly _username;
    private readonly _password;
    private readonly _totpProvider?;
    private _accessToken?;
    constructor(username: string, password: string, totpProvider?: TotpProvider);
    authenticate(restClient: MultiplexedRestClient, requestInit: NodeRequestInit, cancellationToken?: CancellationToken): Promise<void>;
    private provideAdditionalAuthFactor;
    private provideTotpFactor;
    handleUnauthorizedRequest(restClient: MultiplexedRestClient, response: NodeResponse, problem?: RestProblem, cancellationToken?: CancellationToken): Promise<void>;
    private parseJwt;
}
//# sourceMappingURL=BearerAuthenticator.d.ts.map