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
import { DailyUsageListSegment } from "../models/DailyUsageListSegment";

/**
 * Returns the current credits balance for the Verifalia account.
 * To add credit packs to your Verifalia account visit https://verifalia.com/client-area#/credits/add
 *
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export const getCreditsBalance = async (restClientFactory: RestClientFactory, cancellationToken?: CancellationToken): Promise<Balance> => {
    const restClient = restClientFactory.build();

    return await (
        await restClient.invoke<Balance>("GET",
            '/credits/balance',
            undefined,
            undefined,
            undefined,
            cancellationToken
        )
    ).deserialize();
}

/**
 * Lists the daily usages of the credits for the Verifalia account.
 *
 * @param options The options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export async function* listCreditsDailyUsages(restClientFactory: RestClientFactory, options?: DailyUsageListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<DailyUsage> {
    const restClient = restClientFactory.build();
    let listSegment: DailyUsageListSegment | null = null;

    do {
        const params: any = {};

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

        const response = await restClient.invoke<DailyUsageListSegment>(
            'GET',
            `/credits/daily-usage`,
            params,
            undefined,
            undefined,
            cancellationToken
        );

        // TODO: Check the response status code

        listSegment = await response.deserialize();

        for (const item of listSegment.data) {
            if (cancellationToken) {
                cancellationToken.throwIfCancellationRequested();
            }

            yield item;
        }
    } while ((listSegment.meta || {}).isTruncated);
}