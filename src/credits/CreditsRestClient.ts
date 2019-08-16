import { DailyUsageListSegment } from './models/DailyUsageListSegment';
import { DailyUsageListingOptions } from './models/DailyUsageListingOptions';
import { IRestClientFactory } from "../IRestClientFactory";
import { Balance } from "./models/Balance";
import { Direction } from '../common/Direction';

export class CreditsRestClient {
    private _restClientFactory: IRestClientFactory;

    constructor(restClientFactory: IRestClientFactory) {
        this._restClientFactory = restClientFactory;
    }

    /**
     * Returns the current credits balance for the Verifalia account.
     */
    public async getBalance(): Promise<Balance> {
        const restClient = this._restClientFactory.build();
        return (await restClient.invoke<Balance>('GET', '/credits/balance')).data;
    }

    /**
     * Lists the daily usages of the credits for the Verifalia account.
     * @param options The options for the listing operation.
     */
    public async * listDailyUsages(options: DailyUsageListingOptions) {
        const restClient = this._restClientFactory.build();
        let listSegment: DailyUsageListSegment | null = null;

        do {
            const params: any = {};

            if (listSegment && listSegment.meta && listSegment.meta.cursor) {
                const cursorParamName = options.direction === Direction.Backward
                    ? "cursor:prev"
                    : "cursor";

                params[cursorParamName] = listSegment.meta.cursor;
            }
            else {
                // Filters

                if (options.dateFilter) {
                    for (const fragment of options.dateFilter.serialize('date')) {
                        params[fragment.key] = fragment.value;
                    }
                }
            }

            const response = await restClient.invoke<DailyUsageListSegment>('GET',
                `/credits/daily-usage`,
                params);

            // TODO: Check the response status code

            listSegment = response.data;

            for (const item of listSegment.data) {
                yield item;
            }
        } while ((listSegment.meta || {}).isTruncated);
    }
}