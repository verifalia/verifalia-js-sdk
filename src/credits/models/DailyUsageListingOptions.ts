import { ListingOptions } from '../../common/models/ListingOptions';
import { DateFilterPredicate } from "../../common/filters/DateFilterPredicate";

export interface DailyUsageListingOptions extends ListingOptions {
    dateFilter: DateFilterPredicate;
}
