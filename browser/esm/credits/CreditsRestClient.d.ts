import { DailyUsageListingOptions } from './models/DailyUsageListingOptions';
import { RestClientFactory } from "../rest/RestClientFactory";
import { Balance } from "./models/Balance";
import { CancellationToken } from '../common/CancellationToken';
import { DailyUsage } from './models/DailyUsage';
export declare class CreditsRestClient {
    private readonly _restClientFactory;
    constructor(restClientFactory: RestClientFactory);
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
    getBalance(cancellationToken?: CancellationToken): Promise<Balance>;
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
    listDailyUsages(options?: DailyUsageListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<DailyUsage>;
}
//# sourceMappingURL=CreditsRestClient.d.ts.map