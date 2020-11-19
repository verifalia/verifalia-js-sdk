import { RestClientFactory } from "../../rest/RestClientFactory";
import { Validation } from "../models/Validation";
import { ValidationRequestEntry } from "../models/ValidationRequestEntry";
import { ValidationRequest } from "../models/ValidationRequest";
import { WaitingStrategy } from "../WaitingStrategy";
import { ValidationOverview } from "../models/ValidationOverview";
import { CancellationToken } from "../../common/CancellationToken";
import { FileValidationRequest } from "../models/FileValidationRequest";
import { ValidationOverviewListingOptions } from "../models/ValidationOverviewListingOptions";
/**
 * Submits a new email validation for processing. By default, this method does not wait for
 * the completion of the email validation job: pass a `WaitingStrategy` (or `true`, to wait
 * until the job is completed) to request a different waiting behavior.
 * This method returns a `Promise` which can be awaited and can be cancelled through a `CancellationToken`.
 *
 * @param request An object with one or more email addresses to validate. Can be of type string, string[],
 * ValidationRequestEntry, ValidationRequestEntry[], ValidationRequest.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function submitEmailValidation(restClientFactory: RestClientFactory, request: string | string[] | ValidationRequestEntry | ValidationRequestEntry[] | ValidationRequest, waitingStrategy?: WaitingStrategy | boolean, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Submits a new email validation for processing through a file, with support for the following
 * formats:
 * - plain text files (.txt), with one email address per line
 * - comma-separated values (.csv), tab-separated values (.tsv) and other delimiter-separated values files
 * - Microsoft Excel spreadsheets (.xls and .xlsx)
 *
 * By default, this method does not wait for the completion of the email validation job: pass a
 * waitingStrategy (or `true`, to wait until the job is completed) to request a different waiting behavior.
 * This method can be cancelled through a `CancellationToken`.
 *
 * @param request An object with the file which includes the email addresses to validate and its processing
 * options. Must be of type `FileValidationRequest`.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the
 * email validation. Can be `true` to wait for the completion or an instance of `WaitingStrategy` for
 * advanced scenarios and progress tracking.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function submitEmailValidationFile(restClientFactory: RestClientFactory, request: FileValidationRequest, waitingStrategy?: WaitingStrategy | boolean, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Returns an email validation job previously submitted for processing. By default, this method does
 * not wait for the eventual completion of the email validation job: pass a
 * waitingStrategy (or `true`, to wait until the job is completed) to request a different waiting behavior.
 * This method can be cancelled through a `CancellationToken`.
 *
 * @param id The ID of the email validation job to retrieve.
 * @param waitingStrategy The strategy which rules out how to wait for the completion of the email
 * validation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function getEmailValidation(restClientFactory: RestClientFactory, id: string, waitingStrategy?: WaitingStrategy | boolean, cancellationToken?: CancellationToken): Promise<Validation | null>;
/**
 * Deletes an email validation job previously submitted for processing.
 *
 * @param id The ID of the email validation job to delete.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function deleteEmailValidation(restClientFactory: RestClientFactory, id: string, cancellationToken?: CancellationToken): Promise<void>;
/**
 * Lists all the email validation jobs, from the oldest to the newest. Pass a `ValidationOverviewListingOptions`
 * to specify filters and a different sorting.
 * This method can be cancelled through a `CancellationToken`.
 *
 * @param options A `ValidationOverviewListingOptions` representing the options for the listing operation.
 * @param cancellationToken An optional token used to cancel the asynchronous request.
 */
export declare function listEmailValidations(restClientFactory: RestClientFactory, options?: ValidationOverviewListingOptions, cancellationToken?: CancellationToken): AsyncGenerator<ValidationOverview>;
//# sourceMappingURL=index.d.ts.map