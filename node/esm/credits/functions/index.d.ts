import { CancellationToken } from "../../common/CancellationToken";
import { RestClientFactory } from "../../rest/RestClientFactory";
import { Balance } from "../models/Balance";
import { DailyUsage } from "../models/DailyUsage";
import { DailyUsageListingOptions } from "../models/DailyUsageListingOptions";
/**
 * Returns the current credits balance for the Verifalia account.
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