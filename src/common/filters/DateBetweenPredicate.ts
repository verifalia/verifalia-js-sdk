import { format } from 'date-fns';
import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';

export class DateBetweenPredicate extends DateFilterPredicate {
    public since?: Date;
    public until?: Date;

    constructor(since?: Date, until?: Date) {
        super();

        this.since = since;
        this.until = until;
    }

    public serialize(fieldName: string): FilterPredicateFragment[] {
        const fragments: FilterPredicateFragment[] = [];

        if (this.since) {
            fragments.push({
                key: `${fieldName}:since`,
                value: format(this.since, 'YYYY-MM-DD')
            });
        }

        if (this.until) {
            fragments.push({
                key: `${fieldName}:until`,
                value: format(this.until, 'YYYY-MM-DD')
            });
        }

        return fragments;
    }
}
