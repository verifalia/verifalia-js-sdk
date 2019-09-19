import axios from 'axios';
import { LoggerFactory } from './environments/environment';

// Display outgoing requests to the API on the console (debug build only)

const loggerFactory = new LoggerFactory();
const logger = loggerFactory.build('verifalia');

axios
	.interceptors
	.request
	.use(
		(config: any) => {
			logger.log('invoking URL', config.url);
			logger.log('params', config.params);
			logger.log('data', config.data);
			logger.log('headers', config.headers);

			return config;
		},
		(error: any) => {
			return Promise.reject(error);
		});

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
export { Validation } from './email-validations/models/Validation'
export { ValidationOverview } from './email-validations/models/ValidationOverview'
export { ValidationEntry } from './email-validations/models/ValidationEntry'
export { VerifaliaRestClientConfiguration } from './VerifaliaRestClientConfiguration';
export { DailyUsageListingOptions } from './credits/models/DailyUsageListingOptions';
export { Balance } from './credits/models/Balance';
export { DailyUsage } from './credits/models/DailyUsage';
export { Direction } from './common/Direction';
export { OperationCancelledError } from './errors/OperationCancelledError';