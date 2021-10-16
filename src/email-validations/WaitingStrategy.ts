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

import { ValidationOverview } from "./models/ValidationOverview";
import { Logger } from '../diagnostics/Logger';
import { OperationCanceledError } from "../errors/OperationCanceledError";
import { CancellationToken } from "../common/CancellationToken";

const logger = new Logger('verifalia');
const timeSpanMatchRegex = /^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/;

type ProgressCallback = (value: ValidationOverview) => void;

/**
 * Defines a strategy used to wait for the completion of an email verification job in Verifalia.
 */
export class WaitingStrategy {
    public waitForCompletion: boolean;
    public progress: ProgressCallback | null;

    constructor(waitForCompletion: boolean, progress: ProgressCallback | null = null) {
        this.waitForCompletion = waitForCompletion;
        this.progress = progress;
    }

    public async waitForNextPoll(validationOverview: ValidationOverview, cancellationToken?: CancellationToken): Promise<void> {
        // Throws in the event the user requested to cancel a pending waiting

        if (cancellationToken) {
            cancellationToken.throwIfCancellationRequested();
        }

        // Observe the ETA if we have one, otherwise a delay given the formula: max(0.5, min(30, 2^(log(noOfEntries, 10) - 1)))

        let delay: number = Math.max(0.5, Math.min(30, Math.pow(2, Math.log10(validationOverview.noOfEntries) - 1)));

        if (validationOverview.progress && validationOverview.progress.estimatedTimeRemaining) {
            const timespanMatch = timeSpanMatchRegex.exec(validationOverview.progress.estimatedTimeRemaining);

            if (timespanMatch) {
                // eslint-disable-next-line radix
                const hours = parseInt(timespanMatch[2]);
                // eslint-disable-next-line radix
                const minutes = parseInt(timespanMatch[3]);
                // eslint-disable-next-line radix
                const seconds = parseInt(timespanMatch[4]);

                // Calculate the delay (in seconds)

                delay = seconds;
                delay += minutes * 60;
                delay += hours * 3600;

                // TODO: Follow the ETA more precisely: as a safenet, we are constraining it to a maximum of 30s for now.

                delay = Math.max(0.5, Math.min(30, delay));
            }
        }

        /* @if ENVIRONMENT!='production' */
        logger.log('waitForNextPoll delay (seconds)', delay);
        /* @endif */

        return new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-const
            let timeout: any;

            // Upon the eventual cancellation of the token, will clear the pending timeout and immediately reject the promise
            // with an OperationCanceledError.

            const onCanceled = () => {
                clearTimeout(timeout);
                reject(new OperationCanceledError());
            };

            timeout = setTimeout(() => {
                if (cancellationToken) {
                    cancellationToken.unregister(onCanceled)
                }

                resolve();
            }, delay * 1000);

            if (cancellationToken) {
                cancellationToken.register(onCanceled);
            }
        });
    }
}