var request = require('request');
var WaitForCompletionOptions = require('./WaitForCompletionOptions');

var EmailValidationClient = function(restClient) {
	this.restClient = restClient;
};

EmailValidationClient.prototype.VALIDATION_STATUS_PENDING = 'pending';
EmailValidationClient.prototype.VALIDATION_STATUS_COMPLETED = 'completed';

EmailValidationClient.prototype.submit = function(emailAddresses, options) {
	var callback = options instanceof Function ? options : (options && options.callback) || (()=>{});

	var completionOptions = (options && options.waitForCompletion);
	
	if (typeof emailAddresses === 'string' || emailAddresses instanceof String) {
		emailAddresses = [ emailAddresses ];
	}
	
	var entries = [];
	
	for (var idx = 0; idx < emailAddresses.length; idx++) {
		entries.push({
			inputData: emailAddresses[idx]
		});
	}
	
	var $this = this;

	request({
			url: this.restClient.baseUrl + this.restClient.apiVersion + '/email-validations',
			method: 'POST',
			body: {
				entries: entries
			},
			json: true,
			auth: {
				user: this.restClient.accountSid,
				pass: this.restClient.authToken
			},
			header: {
				Accept: 'application/json'
			}
		},
		function onResponse(error, response, body) {
			if (error) {
				return callback(error, null);
			}
			
			switch (response.statusCode) {
				case 202: { // Accepted
					response.status = $this.VALIDATION_STATUS_PENDING;
					
					if (completionOptions) {
						return setTimeout(function onTimeout() {
								queryUntilDone($this, body.uniqueID, completionOptions, callback);
							},
							completionOptions.pollingInterval || WaitForCompletionOptions.DEFAULT_QUERY_POLLING_INTERVAL);
					}
					
					return callback(null, body);
				}

				case 200: { // OK
					response.status = $this.VALIDATION_STATUS_COMPLETED;
					return callback(null, body);
				}

				case 404: // Not found
				case 410: // Gone
					return callback(null, null);
			}
			
			return callback('Unexpected HTTP status code: ' + response.statusCode + '. ' + response.statusMessage, null);
		});
};

var queryOnce = function($this, uniqueID, requestTimeout, callback) {
	request({
			url: $this.restClient.baseUrl + $this.restClient.apiVersion + '/email-validations/' + uniqueID,
			json: true,
			auth: {
				user: $this.restClient.accountSid,
				pass: $this.restClient.authToken
			},
			header: {
				Accept: 'application/json'
			},
			timeout: requestTimeout
		},
		function onResponse(error, response, body) {
			if (error) {
				return callback(error, null);
			}
			
			switch (response.statusCode) {
				case 200: { // OK
					body.status = $this.VALIDATION_STATUS_COMPLETED;
					return callback(null, body);
				}
				
				case 202: { // Accepted
					body.status = $this.VALIDATION_STATUS_PENDING;
					return callback(null, body);
				}

				case 404: // Not found
				case 410: // Gone
					return callback(null, null);
			}
			
			return callback('Unexpected HTTP status code: ' + response.statusCode + '. ' + response.statusMessage, null);
		});
}

var queryUntilDone = function($this, uniqueID, completionOptions, callback) {
	queryOnce($this, uniqueID, completionOptions.requestTimeout || WaitForCompletionOptions.DEFAULT_REQUEST_TIMEOUT, function onResponse(error, data) {
		if (error) {
			return callback(error, null);
		}

		if (data != null) {
			if (data.status === $this.VALIDATION_STATUS_PENDING) {
				return setTimeout(function onTimeout() {
						queryUntilDone($this, uniqueID, completionOptions, callback);
					}, completionOptions.pollingInterval || WaitForCompletionOptions.DEFAULT_QUERY_POLLING_INTERVAL);
			}
		}
		
		callback(null, data);
	});
};

EmailValidationClient.prototype.query = function(uniqueID, options) {
	var callback = options instanceof Function
		? options
		: (options && options.callback) || (()=>{});
		
	var completionOptions = (options && options.waitForCompletion);

	if (!completionOptions) {
		return queryOnce(this, uniqueID, WaitForCompletionOptions.DEFAULT_REQUEST_TIMEOUT, callback);
	}

	var $this = this;
	queryUntilDone(this, uniqueID, completionOptions, callback);
};

EmailValidationClient.prototype.delete = function(uniqueID, options) {
	var callback = options instanceof Function
		? options
		: (options && options.callback) || (()=>{});

	request({
			url: this.restClient.baseUrl + this.restClient.apiVersion + '/email-validations/' + uniqueID,
			method: 'DELETE',
			auth: {
				user: this.restClient.accountSid,
				pass: this.restClient.authToken
			}
		},
		function onResponse(error, response, body) {
			if (error) {
				return callback(error, null);
			}
			
			switch (response.statusCode) {
				case 200: { // OK
					return callback(null, null);
				}
			}
			
			return callback('Unexpected HTTP status code: ' + response.statusCode + '. ' + response.statusMessage, null);
		});
};

module.exports = EmailValidationClient;
