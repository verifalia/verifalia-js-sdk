// (c) Verifalia - email verification service - https://verifalia.com
import { __awaiter, __asyncGenerator, __await } from 'tslib';

/**
 * Returns the current credits balance for the Verifalia account.
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
