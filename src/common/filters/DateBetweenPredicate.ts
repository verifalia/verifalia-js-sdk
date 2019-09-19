import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';
import { formatDateToIso8601 } from '../DateUtils';

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
                value: formatDateToIso8601(this.since)
            });
        }

        if (this.until) {
            fragments.push({
                key: `${fieldName}:until`,
                value: formatDateToIso8601(this.until)
            });
        }

        return fragments;
    }
}
