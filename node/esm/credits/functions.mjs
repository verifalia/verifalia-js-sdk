// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter, __asyncGenerator, __await } from 'tslib';

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
/**
 * Returns the current credits balance for the Verifalia account.
 * To add credit packs to your Verifalia account visit https://verifalia.com/client-area#/credits/add
 *
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
const getCreditsBalance = (restClientFactory, cancellationToken) => __awaiter(void 0, void 0, void 0, function* () {
    const restClient = restClientFactory.build();
    return yield (yield restClient.invoke("GET", '/credits/balance', undefined, undefined, undefined, cancellationToken)).deserialize();
});
/**
 * Lists the daily usages of the credits for the Verifalia account.
 *
 * @param options The options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
function listCreditsDailyUsages(restClientFactory, options, cancellationToken) {
    return __asyncGenerator(this, arguments, function* listCreditsDailyUsages_1() {
        const restClient = restClientFactory.build();
        let listSegment = null;
        do {
            const params = {};
            if (options) {
                if (listSegment && listSegment.meta && listSegment.meta.cursor) {
                    const cursorParamName = options.isBackward
                        ? "cursor:prev"
                        : "cursor";
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    params[cursorParamName] = listSegment.meta.cursor;
                }
                else {
                    // Filters
                    if (options.dateFilter) {
                        for (const fragment of options.dateFilter.serialize('date')) {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            params[fragment.key] = fragment.value;
                        }
                    }
                }
            }
            const response = yield __await(restClient.invoke('GET', `/credits/daily-usage`, params, undefined, undefined, cancellationToken));
            // TODO: Check the response status code
            listSegment = yield __await(response.deserialize());
            for (const item of listSegment.data) {
                if (cancellationToken) {
                    cancellationToken.throwIfCancellationRequested();
                }
                yield yield __await(item);
            }
        } while ((listSegment.meta || {}).isTruncated);
    });
}

export { getCreditsBalance, listCreditsDailyUsages };
