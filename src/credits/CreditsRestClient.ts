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

import { DailyUsageListingOptions } from './models/DailyUsageListingOptions';
import { RestClientFactory } from "../rest/RestClientFactory";
import { Balance } from "./models/Balance";
import { CancellationToken } from '../common/CancellationToken';
import { getCreditsBalance, listCreditsDailyUsages } from './functions';
import { DailyUsage } from './models/DailyUsage';

export class CreditsRestClient {
    private readonly _restClientFactory: RestClientFactory;

    constructor(restClientFactory: RestClientFactory) {
        this._restClientFactory = restClientFactory;
    }

    /**
     * Returns the current credits balance for the Verifalia account.
     *
     * Here is an example:
     * ```ts
     * // Option 1 - async/await
     *
     * const verifalia = new VerifaliaRestClient(...);
     * const balance = await verifalia
     *     .credits
     *     .getBalance();
     *
     * console.log(`Credit packs: ${balance.creditPacks}, free credits: ${balance.freeCredits}`);
     * // 'Credit packs: 507.23, free credits: 10.86'
     *
     * // Option 2 - callback
     *
     * const verifalia = new VerifaliaRestClient(...);
     * verifalia
     *     .credits
     *     .getBalance()
     *     .then(balance => {
     *         console.log(`Credit packs: ${balance.creditPacks}, free credits: ${balance.freeCredits}`);
     *         // 'Credit packs: 507.23, free credits: 10.86'
     *     });
     * ```
     *
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    public getBalance(cancellationToken?: CancellationToken): Promise<Balance> {
        return getCreditsBalance(this._restClientFactory, cancellationToken);
    }

    /**
     * Lists the daily usages of the credits for the Verifalia account, according to the specified
     * listing options.
     *
     * Here is how to list the credit daily usages between two dates:
     * ```ts
     * const verifalia = new VerifaliaRestClient(...);
     * const dailyUsages = verifalia
     *     .credits
     *     .listDailyUsages({
     *         dateFilter: new DateBetweenPredicate(new Date(2020, 10, 15), new Date(2020, 10, 23))
     *     });
     *
     * for await (const dailyUsage of dailyUsages) {
     *     console.log(`Date: ${dailyUsage.date}, credit packs: ${dailyUsage.creditPacks}, free credits: ${dailyUsage.freeCredits}`);
     *     // 'Date: 2020-10-15, credit packs: 98.85, free credits: 50'
     *     // 'Date: 2020-10-16, credit packs: 0, free credits: 19.26'
     *     // ...
     *     // 'Date: 2020-10-23, credit packs: 1.565, free credits: 50'
     * }
     * ```
     *
     * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
     *
     * @param options A `DailyUsageListingOptions` with the options for the listing operation.
     * @param cancellationToken An optional token used to cancel the asynchronous request.
     */
    public listDailyUsages(options?: DailyUsageListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<DailyUsage> {
        return listCreditsDailyUsages(this._restClientFactory, options, cancellationToken);
    }
}