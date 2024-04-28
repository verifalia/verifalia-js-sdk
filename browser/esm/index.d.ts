/**
 * @license
 * Verifalia - Email list cleaning and real-time email verification service
 * https://verifalia.com/
 * support@verifalia.com
 *
 * Copyright (c) 2005-2024 Cobisi Research
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
export { VerifaliaRestClient } from './VerifaliaRestClient';
export { VerifaliaRestClientFactory } from './rest/VerifaliaRestClientFactory';
export { UsernamePasswordAuthenticator } from './rest/security/UsernamePasswordAuthenticator';
export { BearerAuthenticator } from './rest/security/BearerAuthenticator';
export { TotpProvider } from './rest/security/TotpProvider';
export { EmailValidationsRestClient } from './email-validations/EmailValidationsRestClient';
export { FileValidationRequest } from './email-validations/models/FileValidationRequest';
export { Validation } from './email-validations/models/Validation';
export { ValidationEntry } from './email-validations/models/ValidationEntry';
export { ValidationOverview } from './email-validations/models/ValidationOverview';
export { ValidationOverviewListingOptions } from './email-validations/models/ValidationOverviewListingOptions';
export { ValidationRequest } from './email-validations/models/ValidationRequest';
export { ValidationRequestEntry } from './email-validations/models/ValidationRequestEntry';
export { WaitOptions } from './email-validations/WaitOptions';
export * from './email-validations/constants';
export * from './email-validations/functions';
export { Balance } from './credits/models/Balance';
export { CreditsRestClient } from './credits/CreditsRestClient';
export { DailyUsage } from './credits/models/DailyUsage';
export { DailyUsageListingOptions } from './credits/models/DailyUsageListingOptions';
export * from './credits/functions';
export { DateBetweenPredicate } from './common/filters/DateBetweenPredicate';
export { DateEqualityPredicate } from './common/filters/DateEqualityPredicate';
export { VerifaliaRestClientConfiguration } from './VerifaliaRestClientConfiguration';
export { AuthenticationError } from './errors/AuthenticationError';
export { AuthorizationError } from './errors/AuthorizationError';
export { CaptchaValidationError } from './errors/CaptchaValidationError';
export { InsufficientCreditError } from './errors/InsufficientCreditError';
export { EndPointServerError } from './errors/EndPointServerError';
export { OperationCanceledError } from './errors/OperationCanceledError';
export { RestError } from './errors/RestError';
export { RequestThrottledError } from './errors/RequestThrottledError';
export { ServiceUnreachableError } from './errors/ServiceUnreachableError';
export { VerifaliaError } from './errors/VerifaliaError';
export { CancellationToken } from './common/CancellationToken';
export { RestProblem } from './rest/RestProblem';
export * from './rest/constants';
//# sourceMappingURL=index.d.ts.map