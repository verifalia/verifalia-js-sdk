/**
 * A total usage of Verifalia credits along a specific day.
 */
export interface DailyUsage {
    /**
     * The date this credits usage refers to.
     */
    date: Date;

    /**
     * The number of free daily credits used during the day. Free daily credits depend on the plan
     * of your Verifalia account; visit https://verifalia.com/client-area#/account/change-plan to
     * change your plan.
     */
    freeCredits: number;

    /**
     * The number of credit packs used during the day. Visit https://verifalia.com/client-area#/credits/add
     * to add credit packs to your Verifalia account.
     */
    creditPacks: number;
}