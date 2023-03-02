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
import { ValidationOverview } from "./models/ValidationOverview";
import { CancellationToken } from "../common/CancellationToken";
declare type ProgressCallback = (value: ValidationOverview) => void;
/**
 * Provides optional configuration settings for waiting on the completion of an email validation job.
 */
export declare class WaitOptions {
    /**
     * Indicates that the library should automatically wait for the email validation to complete, using
     * the default wait times.
     */
    static default: WaitOptions;
    /**
     * Indicates that the library should not wait for the email validation to complete.
     */
    static noWait: WaitOptions;
    /**
     * If set, defines a function which receives completion progress updates for an email validation job.
     */
    progress: ProgressCallback | null;
    /**
     * Defines how much time to ask the Verifalia API to wait for the completion of the job on the server side,
     * during the initial job submission request. Expressed in milliseconds, with a default of 30 seconds.
     */
    submissionWaitTime: number;
    /**
     * Defines how much time to ask the Verifalia API to wait for the completion of the job on the server side,
     * during any of the polling requests. Expressed in milliseconds, with a default of 30 seconds.
     */
    pollWaitTime: number;
    /**
     * Waits for the next polling interval of the specified validationOverview.
     *
     * @param validationOverview The validation overview to wait against.
     * @param cancellationToken The eventual cancellation token for the waiting.
     */
    waitForNextPoll(validationOverview: ValidationOverview, cancellationToken?: CancellationToken): Promise<void>;
}
export {};
//# sourceMappingURL=WaitOptions.d.ts.map