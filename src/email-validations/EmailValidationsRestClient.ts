import { RestClientFactory } from "../RestClientFactory";
import { Validation } from "./models/Validation";
import { ValidationRequestEntry } from "./models/ValidationRequestEntry";
import { ValidationRequest } from "./models/ValidationRequest";
import { WaitingStrategy } from "./WaitingStrategy";
import { ValidationOverview } from "./models/ValidationOverview";
import { ValidationEntryListSegment } from "./models/ValidationEntryListSegment";
import { VerifaliaError } from "../errors/VerifaliaError";
import { ValidationStatus } from "./models/ValidationStatus";
import { ValidationEntry } from "./models/ValidationEntry";
import { ListingCursor } from "../common/models/ListingCursor";
import { Direction } from "../common/Direction";

declare type PartialValidation = {
    overview: ValidationOverview,
    entries: ValidationEntryListSegment
};

export class EmailValidationsRestClient {
    private readonly _restClientFactory: RestClientFactory;

    constructor(restClientFactory: RestClientFactory) {
        this._restClientFactory = restClientFactory;
    }

    /**
     * Submits a new email validation for processing. By default, this method does not wait for
     * the completion of the email validation job: specify a waitingStrategy to request a different
     * waiting behavior.
     * @param data An object with one or more email addresses to validate. Can be of type string, string[],
     * ValidationRequestEntry, ValidationRequestEntry[], ValidationRequest.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the
     * email validation. Can be true to wait for the completion or an instance of WaitingStrategy for
     * advanced scenarios and progress tracking.
     */
    public async submit(data: string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest, waitingStrategy?: WaitingStrategy | boolean): Promise<Validation | null> {
        const restClient = this._restClientFactory.build();
        let request: ValidationRequest;

        if (typeof data === 'string') {
            request = {
                entries: [{
                    inputData: data
                }]
            } as ValidationRequest;
        } else if (Array.isArray(data) && data.every((item: any) => typeof item === 'string')) {
            const entries = (<string[]>data).map((item) => <ValidationRequestEntry>{
                inputData: item
            });

            request = {
                entries: entries
            } as ValidationRequest;
        } else if ((<any>data).inputData) {
            // Single ValidationRequestEntry

            request = {
                entries: [<ValidationRequestEntry>data]
            }
        } else if (Array.isArray(data) && data.every((item: any) => item.inputData)) {
            // Array of ValidationRequestEntry

            request = {
                entries: data
            } as ValidationRequest;
        } else if ((<any>data).entries) {
            // ValidationRequest

            request = <ValidationRequest>data;
        } else {
            throw new Error('data type is unsupportd.');
        }

        if (typeof waitingStrategy === 'boolean') {
            waitingStrategy = new WaitingStrategy(waitingStrategy);
        }

        const response = await restClient.invoke<PartialValidation>('POST',
            '/email-validations',
            undefined,
            request);

        if (response.status === 200 || response.status === 202) {
            const partialValidation = response.data;

            // Returns immediately if the validation has been completed or if we should not wait for it

            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status == ValidationStatus.Completed) {
                return this.retrieveValidationFromPartialValidation(partialValidation);
            }

            return this.waitValidationForCompletion(partialValidation.overview, waitingStrategy);
        }

        if (response.status === 404 || response.status === 410) {
            return null;
        }

        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    }

    /**
     * Returns an email validation job previously submitted for processing. By default, this method does
     * not wait for the eventual completion of the email validation job: pass a waitingStrategy to
     * request a different waiting behavior.
     * @param id The ID of the email validation job to retrieve.
     * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
     * validation.
     */
    public async get(id: string, waitingStrategy?: WaitingStrategy | boolean): Promise<Validation | null> {
        const restClient = this._restClientFactory.build();
        const response = await restClient.invoke<PartialValidation>('GET', `/email-validations/${id}`);

        if (response.status === 200 || response.status === 202) {
            const partialValidation = response.data;

            // Returns immediately if the validation has been completed or if we should not wait for it

            if (typeof waitingStrategy === 'boolean') {
                waitingStrategy = new WaitingStrategy(waitingStrategy);
            }

            if (!waitingStrategy || !waitingStrategy.waitForCompletion || partialValidation.overview.status == ValidationStatus.Completed) {
                return this.retrieveValidationFromPartialValidation(partialValidation);
            }

            return this.waitValidationForCompletion(partialValidation.overview, waitingStrategy);
        }

        if (response.status === 404 || response.status === 410) {
            return null;
        }

        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    }

    /**
     * Deletes an email validation job previously submitted for processing.
     * @param id The ID of the email validation job to delete.
     */
    public async delete(id: string) {
        const restClient = this._restClientFactory.build();
        const response = await restClient.invoke<void>('DELETE', `/email-validations/${id}`);

        if (response.status === 200 || response.status === 410) {
            return;
        }

        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    }

    private async retrieveValidationFromPartialValidation(partialValidation: PartialValidation): Promise<Validation> {
        const allEntries: ValidationEntry[] = [];
        let currentSegment = partialValidation.entries;

        while (currentSegment && currentSegment.data) {
            allEntries.push(...currentSegment.data);

            if (!currentSegment.meta.isTruncated) {
                break;
            }

            currentSegment = await this.listEntriesSegmentedAsync(partialValidation.overview.id,
                <ListingCursor>{ cursor: currentSegment.meta.cursor });
        }

        return {
            overview: partialValidation.overview,
            entries: allEntries
        };
    }

    private async listEntriesSegmentedAsync(validationId: string, cursor: ListingCursor): Promise<ValidationEntryListSegment> {
        if (!validationId) throw new Error('validationId is null');
        if (!cursor) throw new Error('cursor is null');

        // Generate the additional parameters, where needed

        const restClient = this._restClientFactory.build();

        // Send the request to the Verifalia servers

        const cursorParamName = cursor.direction === Direction.Backward
            ? "cursor:prev"
            : "cursor";

        const queryParams = {
            [cursorParamName]: cursor.cursor
        };

        if (cursor.limit > 0) {
            queryParams["limit"] = cursor.limit.toString();
        }

        const response = await restClient.invoke<ValidationEntryListSegment>('GET',
            `/email-validations/${validationId}/entries`,
            queryParams);

        if (response.status === 200) {
            return response.data;
        }

        throw new VerifaliaError(`Unexpected HTTP response: ${response.status} ${response.statusText}`);
    }

    private async waitValidationForCompletion(validationOverview: ValidationOverview, waitingStrategy: WaitingStrategy): Promise<Validation | null> {
        if (!validationOverview) throw new Error('validationOverview is null');
        if (!waitingStrategy) throw new Error('waitingStrategy is null');

        let resultOverview = validationOverview;

        do {
            // Fires a progress, since we are not yet completed

            if (waitingStrategy.progress) {
                waitingStrategy.progress(resultOverview);
            }

            // Wait for the next polling schedule

            await waitingStrategy.waitForNextPoll(resultOverview);

            // Fetch the job from the API

            const result = await this.get(validationOverview.id);

            if (!result) {
                // A null result means the validation has been deleted (or is expired) between a poll and the next one

                return null;
            }

            resultOverview = result.overview;

            // Returns immediately if the validation has been completed

            if (resultOverview.status === ValidationStatus.Completed) {
                return result;
            }
        } while (true);
    }
}