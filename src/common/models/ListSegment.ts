import { ListSegmentMeta } from "./ListSegmentMeta";

export interface ListSegment<T> {
    meta: ListSegmentMeta;
    data: T[];
}