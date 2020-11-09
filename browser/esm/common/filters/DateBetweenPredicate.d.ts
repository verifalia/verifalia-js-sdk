import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';
export declare class DateBetweenPredicate extends DateFilterPredicate {
    since?: Date;
    until?: Date;
    constructor(since?: Date, until?: Date);
    serialize(fieldName: string): FilterPredicateFragment[];
}
//# sourceMappingURL=DateBetweenPredicate.d.ts.map