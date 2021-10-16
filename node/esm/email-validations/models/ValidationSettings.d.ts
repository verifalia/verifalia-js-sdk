/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 *
 * Copyright (c) 2005-2021 Cobisi Research
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
/**
 * Represents the settings for an email validation request to be submitted against
 * the Verifalia API.
 */
export interface ValidationSettings {
    /**
     * A reference to the expected results quality level for this request. Quality levels
     * determine how Verifalia validates email addresses, including whether and how the
     * automatic reprocessing logic occurs (for transient statuses) and the verification
     * timeouts settings.
     * Use one of Standard, High or Extreme values or a custom quality level ID if you have
     * one (custom quality levels are available to premium plans only).
     * See the constants exported in the QualityLevelName.ts file.
     */
    quality?: string;
    /**
     * The strategy Verifalia follows while determining which email addresses are duplicates,
     * within a multiple items job.
     * Duplicated items (after the first occurrence) will have the Duplicate status.
     * See the constants exported in the DeduplicationMode.ts file.
     */
    deduplication?: string;
    /**
     * The eventual priority (speed) of the validation job, relative to the parent Verifalia account. In the event of an account
     * with many concurrent validation jobs, this value allows to increase the processing speed of a job with respect to the others.
     * The allowed range of values spans from 0 (lowest priority) to 255 (highest priority), where the midway value (127) means
     * normal priority; if not specified, Verifalia processes all the concurrent validation jobs for an account using the same
     * priority.
     * See the constants exported in the ValidationPriority.ts file.
     */
    priority?: number;
    /**
     * An optional user-defined name for the validation job, for your own reference. The name
     * will be returned on subsequent API calls and shown on the Verifalia clients area.
     */
    name?: string;
    /**
     * An optional maximum data retention period Verifalia observes for this verification job,
     * after which the job will be automatically deleted, in the format: [dd.]hh.mm.ss.
     * If unset, forces the service to fall back to the default retention period for the user
     * or browser app which is submitting the job.
     * A verification job can be deleted anytime prior to its retention period through the
     * delete() method; if set, the retention period must have a value between 5 minutes and 30
     * days.
     */
    retention?: string;
    /**
     * An optional callback definition for a publicly-accessible endpoint which will be notified
     * as soon as the validation job is completed. See https://verifalia.com/developers#email-validations-completion-callback
     */
    callback?: {
        /**
         * The URL of the endpoint which will receive the job completion notification callback.
         */
        url: string;
    };
}
//# sourceMappingURL=ValidationSettings.d.ts.map