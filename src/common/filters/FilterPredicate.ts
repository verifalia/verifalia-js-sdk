import { FilterPredicateFragment } from './FilterPredicateFragment';

export abstract class FilterPredicate {
    public abstract serialize(fieldName: string): FilterPredicateFragment[];
}
