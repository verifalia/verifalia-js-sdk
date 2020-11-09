import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';
export declare class DateEqualityPredicate extends DateFilterPredicate {
    date: Date;
    constructor(date: Date);
    serialize(fieldName: string): FilterPredicateFragment[];
}
//# sourceMappingURL=DateEqualityPredicate.d.ts.map