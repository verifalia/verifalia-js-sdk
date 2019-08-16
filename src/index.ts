/*
// Uncomment to display outgoing requests to the API on the console

import axios from 'axios';

axios
	.interceptors
	.request
	.use(
		(config: any) => {
			// Do something before request is sent
			console.log(`** Invoking URL ${config.url}`);
			console.log(`** - params: ${JSON.stringify(config.params)}`);
			console.log(`** - data: ${JSON.stringify(config.data)}`);
			console.log(`** - headers: ${JSON.stringify(config.headers)}`);
			return config;
		},
		(error: any) => {
			return Promise.reject(error);
		});
*/

export { VerifaliaRestClient } from './VerifaliaRestClient';
export { DateEqualityPredicate } from './common/filters/DateEqualityPredicate';
export { DateBetweenPredicate } from './common/filters/DateBetweenPredicate';
export { WaitingStrategy } from './email-validations/WaitingStrategy';
export { ValidationRequest } from './email-validations/models/ValidationRequest';
export { ValidationRequestEntry } from './email-validations/models/ValidationRequestEntry';
export { DeduplicationMode } from './email-validations/models/DeduplicationMode';
export { QualityLevelName } from './email-validations/models/QualityLevelName';
export { ValidationPriority } from './email-validations/models/ValidationPriority'
export { ValidationStatus } from './email-validations/models/ValidationStatus';
export { ValidationEntryClassification } from './email-validations/models/ValidationEntryClassification';
export { ValidationEntryStatus } from './email-validations/models/ValidationEntryStatus';
export { ValidationOverview } from './email-validations/models/ValidationOverview'
export { VerifaliaRestClientConfiguration } from './VerifaliaRestClientConfiguration';
export { DailyUsageListingOptions } from './credits/models/DailyUsageListingOptions';
export { Balance } from './credits/models/Balance';
export { DailyUsage } from './credits/models/DailyUsage';
export { Direction } from './common/Direction';