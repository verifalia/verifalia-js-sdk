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
import { CancellationToken } from "../../common/CancellationToken";
import { RestClientFactory } from "../../rest/RestClientFactory";
import { Balance } from "../models/Balance";
import { DailyUsage } from "../models/DailyUsage";
import { DailyUsageListingOptions } from "../models/DailyUsageListingOptions";
/**
 * Returns the current credits balance for the Verifalia account.
 * To add credit packs to your Verifalia account visit https://verifalia.com/client-area#/credits/add
 *
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare const getCreditsBalance: (restClientFactory: RestClientFactory, cancellationToken?: CancellationToken | undefined) => Promise<Balance>;
/**
 * Lists the daily usages of the credits for the Verifalia account.
 *
 * @param options The options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function listCreditsDailyUsages(restClientFactory: RestClientFactory, options?: DailyUsageListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<DailyUsage>;
//# sourceMappingURL=index.d.ts.map