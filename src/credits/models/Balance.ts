/**
 * The credits balance for the Verifalia account.
 */
export interface Balance {
    /**
     * The number of credit packs (that is, non-expiring credits) available for the account.
     * Visit https://verifalia.com/client-area#/credits/add to add credit packs to your Verifalia
     * account.
     */
    creditPacks: number;

    /**
     * The number of free daily credits of the account. Free daily credits depend on the plan of
     * your Verifalia account; visit https://verifalia.com/client-area#/account/change-plan to
     * change your plan.
     */
    freeCredits: number | null;

    /**
     * The time required for the free daily credits to reset.
     */
    freeCreditsResetIn: string | null;
}