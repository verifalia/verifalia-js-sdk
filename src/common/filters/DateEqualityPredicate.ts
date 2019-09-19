import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';
import { formatDateToIso8601 } from '../DateUtils';

export class DateEqualityPredicate extends DateFilterPredicate {
    public date: Date;

    constructor(date: Date) {
        super();
        
        this.date = date;
    }

    public serialize(fieldName: string): FilterPredicateFragment[] {
        return [
            {
                key: fieldName,
                value: `${formatDateToIso8601(this.date)}`
            }
        ];
    }
}