import { ValidationOverview } from "./models/ValidationOverview";
import { Logger } from '../diagnostics/Logger';
import { OperationCanceledError } from "../errors/OperationCanceledError";
import { CancellationToken } from "../common/CancellationToken";

const logger = new Logger('verifalia');

type ProgressCallback = (value: ValidationOverview) => void;

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
            const timespanMatch = validationOverview.progress.estimatedTimeRemaining.match(/^(?:(\d*?)\.)?(\d{2})\:(\d{2})\:(\d{2})(?:\.(\d*?))?$/);

            if (timespanMatch) {
                const hours = parseInt(timespanMatch[2]);
                const minutes = parseInt(timespanMatch[3]);
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