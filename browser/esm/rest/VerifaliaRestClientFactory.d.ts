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
import { Authenticator } from "./security/Authenticator";
import { RestClientFactory } from "./RestClientFactory";
import { MultiplexedRestClient } from "./MultiplexedRestClient";
/**
 * A factory of MultiplexedRestClient instances, used to issue REST commands against the Verifalia API.
 * This class is here to allow a fine-grained import of the required Verifalia features by the SDK consumers,
 * as well as to allow for the tree shaker to do its job.
 */
export declare class VerifaliaRestClientFactory implements RestClientFactory {
    /**
     * Gets or sets the version of the Verifalia API to use when making requests; defaults to the latest API
     * version supported by this SDK. Warning: changing this value may affect the stability of the SDK itself.
     */
    apiVersion: string;
    private _cachedRestClient;
    private readonly _authenticator;
    private readonly _baseUris;
    /**
     * Initializes a new HTTPS-based REST client for Verifalia with the specified authenticator.
     *
     * @param authenticator The authenticator used to invoke the Verifalia service.
     * @param baseUris The base Verifalia API endpoints used to invoke the Verifalia service.
     */
    constructor(authenticator: Authenticator, baseUris: string[]);
    build(): MultiplexedRestClient;
    private getUserAgent;
}
//# sourceMappingURL=VerifaliaRestClientFactory.d.ts.map