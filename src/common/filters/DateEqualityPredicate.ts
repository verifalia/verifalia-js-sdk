import { format } from 'date-fns';
import { FilterPredicateFragment } from './FilterPredicateFragment';
import { DateFilterPredicate } from './DateFilterPredicate';

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
                value: `${format(this.date, 'YYYY-MM-DD')}`
            }
        ];
    }
}