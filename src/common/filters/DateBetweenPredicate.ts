/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 * 
 * Copyright (c) 2005-2023 Cobisi Research
 * 
 * Cobisi Research
 * Via Della Costituzione, 31
 * 35010 Vigonza
 * Italy - European Union
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
