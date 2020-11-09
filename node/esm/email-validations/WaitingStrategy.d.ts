import { ValidationOverview } from "./models/ValidationOverview";
import { CancellationToken } from "../common/CancellationToken";
declare type ProgressCallback = (value: ValidationOverview) => void;
export declare class WaitingStrategy {
    waitForCompletion: boolean;
    progress: ProgressCallback | null;
    constructor(waitForCompletion: boolean, progress?: ProgressCallback | null);
    waitForNextPoll(validationOverview: ValidationOverview, cancellationToken?: CancellationToken): Promise<void>;
}
export {};
//# sourceMappingURL=WaitingStrategy.d.ts.map