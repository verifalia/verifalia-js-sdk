import { CancellationToken } from "../../common/CancellationToken";
import { RestClientFactory } from "../../rest/RestClientFactory";
import { Balance } from "../models/Balance";
import { DailyUsage } from "../models/DailyUsage";
import { DailyUsageListingOptions } from "../models/DailyUsageListingOptions";
import { DailyUsageListSegment } from "../models/DailyUsageListSegment";

/**
 * Returns the current credits balance for the Verifalia account.
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