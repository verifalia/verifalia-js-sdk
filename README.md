![Verifalia API](https://img.shields.io/badge/Verifalia%20API-v2.3-green)
[![NPM](https://img.shields.io/npm/v/verifalia.svg)](https://www.npmjs.com/package/verifalia)

Verifalia REST API - SDK and helper library for Javascript
==========================================================

[Verifalia][0] provides a fast and accurate API for verifying email addresses in real-time and checking whether they are deliverable, invalid, or otherwise risky: this SDK library integrates with Verifalia and allows to [verify email addresses][0] on Node.js backends and in the browser. It includes artifacts for a wide range of module loaders, including CommonJS (suitable for Node.js) and native ES modules (ideal for modern front-end module bundlers like Webpack and Rollup, for front-end frameworks like Angular, React, Vue, etc. - and supported in Node.js v13+); it also comes with a turn-key single-file IIFE for browsers (compatible with ES5 or higher), with no external dependencies.

# Getting started #

## Install the package ##

The best and easiest way to add the Verifalia email verification Javascript library to your project is to use [npm](https://npmjs.org/), which will automatically download and install the required files. With npm installed, run the following from your project root:

```bash
$ npm install verifalia
```

Once done, you can load the library into your application according to the module system you are using, as explained in the following sections.

## Using Verifalia in Node.js ##

Node.JS applications use the CommonJS module system to load dependencies through the `require(...)` builtin function and, starting from Node.js v13, it is also possible to `import` native ES modules directly: this library includes both CommonJS and native ES modules support.

### CommonJS (default in Node.js) ###

Using this method you can load any export through the `require(...)` Node.js builtin function. Here is how to load the `VerifaliaRestClient` class, which is the main export of this library:

```javascript
const { VerifaliaRestClient } = require('verifalia');
```

The build artifacts are available in the `node/cjs` folder.

### ES modules (available in Node.js v13 and higher) ###

This is the most modern approach and relies on native ES module support in Node.js; here is how to load the `VerifaliaRestClient` class, which is the main export of this library:

```javascript
import { VerifaliaRestClient } from 'verifalia/node/esm/index.mjs';
```

The build artifacts with native ES modules can be found in the `node/esm` folder.

## Using Verifalia in the browser ##

This library includes out of the box support for all modern front-end module bundlers like Webpack and Rollup and for front-end frameworks like Angular, React, Vue, etc. It comes with support for these module systems:

- ES modules;
- CommonJS;
- AMD;
- SystemJS;

And with these additional build artifacts:

- UMD;
- IIFE.

### ES modules (ideal for: Webpack, Rollup, ..., Angular, React, Vue, ...) ###

This is the most modern approach, which allows to improve the module loading time as well as to perform tree shaking on your final bundle; using the features of this library requires the use of the `import` keyword, as shown below:

```javascript
import { VerifaliaRestClient } from 'verifalia';
```

A build artifact with native ES modules is distributed in the `browser/esm` folder.

### CommonJS ###

Using this loading method you can use the features of this library through the `require` function, as shown below:

```javascript
const { VerifaliaRestClient } = require('verifalia');
```

The build artifact with the CommonJS module is available in the `browser/cjs` folder.

### AMD ###

Using this loading method you can use the features of this library through the `define` function, as shown below:

```javascript
define(["verifalia"], function (verifaliaModule) {
	const verifalia = new verifaliaModule.VerifaliaRestClient({
		username: 'samantha',
		password: '42istheanswer'
	});

	return { };
});
```

The build artifact with the CommonJS module is available in the `browser/amd` folder.

### IIFE (single-file, which can be directly included in web-pages as is) ###

While we always recommend using a module loader for a much better performance and duplicate code removal, you can also load the Verifalia SDK along with all its dependencies in a single script and include it in a web page through an IIFE, available at `browser/iife/verifalia.min.js`:

```html
<html>
	<head>
		<!-- Just copy the file from browser/iife/verifalia.min.js -->
		<script src="verifalia.min.js"></script>
		<script>
			// Once the IIFE is loaded, a new "Verifalia" object will be available through
			// the global window. It contains all the exports from the Javascript SDK,
			// including the main VerifaliaRestClient class. Here is how you can instantiate
			// it:
			
			const verifalia = new Verifalia.VerifaliaRestClient({
				username: 'samantha',
				password: '42istheanswer'
			});

			// And here is how to submit an email validation (and wait for its completion):

			verifalia
				.emailValidations
				.submit('batman@gmail.com', true)
				.then(result => {
					console.log('Here is the validation result', result);
				});
		</script>
	</head>
	<body>
		...
	</body>
</html>
```

## Authentication ##

First things first: authentication to the Verifalia API is performed by way of the username and password credentials of your root Verifalia account or
those of a Verifalia user (previously known as sub-account): if you don't have a Verifalia account, just [register for a free one][4]. For security reasons, it is always advisable to [create and use a dedicated user][3] for accessing the API, as doing so will allow to assign only the specific needed permissions to it.

Learn more about authenticating to the Verifalia API at [https://verifalia.com/developers#authentication][2]

Once you have your Verifalia credentials at hand, use them while creating a new instance of the `VerifaliaRestClient` class (see how to import it in your code in the sections above), which will be the starting point to every other operation against the Verifalia API:

```ts
const verifalia = new VerifaliaRestClient({
	username: 'username',
	password: 'password'
});
```

### Browser apps' keys ###

As an alternative to regular Verifalia users, browser apps come with a fixed and extremely small permissions set which only allows to submit email validations and retrieve their results, which may be ideal for a public website or app. If you wish to learn more about how to configure and manage Verifalia browser apps, please see https://verifalia.com/help/sub-accounts/how-to-manage-browser-apps

A browser app key is essentially a username you can use while authenticating against the Verifalia API, which does not have a password. To employ a browser app key with this library, just use it as the `username` field while instantiating a `VerifaliaRestClient` object, as shown below:

```ts
const verifalia = new VerifaliaRestClient({
	username: 'YOUR-BROWSER-APP-KEY-HERE'
});
```

### Authenticating via X.509 client certificate (Node-only) ###

> :warning: This authentication method is only available in Node.js and not in the browser.

This authentication method uses a cryptographic X.509 client certificate to authenticate against the Verifalia API, through the TLS protocol. This method, also called mutual TLS authentication (mTLS) or two-way authentication, offers the highest degree of security, as only a cryptographically-derived key (and not the actual credentials) is sent over the wire on each request. To learn more about this option, please see https://verifalia.com/help/sub-accounts/what-is-x509-tls-client-certificate-authentication

To authenticate using an X.509 client certificate, specify its public key through the `cert` field and pass its private key via the `key` field. An optional
passphrase can be set via with the `passphrase` field.

```ts
const verifalia = new VerifaliaRestClient({
    cert: fs.readFileSync('/home/rmontagnani/my-client-certificate.pem'),
    key: fs.readFileSync('/home/rmontagnani/my-client-certificate.key')
});
```

# Validating email addresses #

Every operation related to verifying / validating email addresses is performed through the `emailValidations` property exposed by the `VerifaliaRestClient` instance you created above. The property contains references to methods which can be used to verify email addresses and manage past validation jobs, as explained below.

## How to validate an email address ##

To validate an email address you can invoke the `submit()` method: it accepts one or more email addresses and any eventual verification options you wish to pass to Verifalia, including the expected results quality, deduplication preferences and processing priority.

In the next example, you can see how to verify a single email address using this library: we automatically wait for the validation completion by passing a `true` value as the second parameter. For more advanced waiting scenarios and progress notifications, you can also pass an instance of the `WaitingStrategy` class.

Here is the example, using the async/await syntax:

```ts
const validation = await verifalia
    .emailValidations
    .submit('batman@gmail.com', true);

// At this point the address has been validated: let's print
// its email validation result to the console.

const entry = validation.entries[0];
console.log(entry.inputData, entry.classification, entry.status);

// Prints out something like:
// batman@gmail.com Deliverable Success
```

And here is the same example, using the promise callback syntax:

```ts
verifalia
    .emailValidations
	.submit('batman@gmail.com', true)
	.then(validation => {
		// At this point the address has been validated: let's print
		// its email validation result to the console.

		const entry = validation.entries[0];
		console.log(entry.inputData, entry.classification, entry.status);

		// Prints out something like:
		// batman@gmail.com Deliverable Success
	});
```

## How to validate a list of email addresses ##

As an alternative to method above you can avoid automatically waiting and, instead, poll and retrieve the email validation results at a later time; this is preferred in the event you are verifying a list of email addresses, which could take minutes or even hours to complete. Note that the same `submit()` method is used to submit a single email address as well as multiple email addresses for validation, based on the type of the parameter.

Here is how to submit some email addresses for validation, without waiting for the actual job completion, using the async/await syntax:

```ts
// Submit the list first

const validation = await verifalia
    .emailValidations
    .submit([{
		"batman@gmail.com",
		"steve.vai@best.music",
		"samantha42@yahoo.de"
	}]);

console.log(`Job Id: ${validation.overview.id}`);
console.log(`Status: ${validation.overview.status}`);

// 'Job Id: 290b5146-eeac-4a2b-a9c1-61c7e715f2e9'
// 'Status InProgress'
```

And here is the promise callback syntax:

```ts
// Submit the list first

verifalia
    .emailValidations
    .submit([{
		"batman@gmail.com",
		"steve.vai@best.music",
		"samantha42@yahoo.de"
	}])
	.then(validation => {
		console.log(`Job Id: ${validation.overview.id}`);
		console.log(`Status: ${validation.overview.status}`);

		// 'Job Id: 290b5146-eeac-4a2b-a9c1-61c7e715f2e9'
		// 'Status InProgress'
	});
```


### How to submit a file for validation ###

This library includes support for submitting and validating files with email addresses, including:
- plain text files (.txt), with one email address per line;
- comma-separated values (.csv), tab-separated values (.tsv) and other delimiter-separated values files;
- Microsoft Excel spreadsheets (.xls and .xlsx).

To submit and validate files, one can still use the `submit()` method mentioned above, passing an object with a `file` field set to, respectively, either a `ReadStream` or a `Buffer` for Node.js and a `Blob` or a `File` for the browser. Along with that field, it is also possible to specify the eventual starting and ending rows to process, the column, the sheet index, the line ending and the delimiter - depending of course on the nature of the submitted file (see `FileValidationRequest` in the source to learn more).

Here is how to validate the email address of an Excel file in Node.js, for example:

```ts
// Import the MIME content type for Excel files (just a string, for our convenience)
import { MimeContentType_ExcelXlsx } from 'verifalia/node/esm/index.mjs';

const file = fs.createReadStream('/home/john/sample.xlsx');

const validation = await verifalia
    .emailValidations
    .submit({
        file: file,
        contentType: MimeContentType_ExcelXlsx,
        startingRow: 1,
        quality: 'high',
        deduplication: 'safe'
    }, true);
```

Validating the email addresses of an Excel file in the browser follows a similar approach:

```html
<!-- This is the file input field in the HTML document -->
<input id="file" type="file" placeholder="Upload a file to validate" />
```
```ts
// Import the MIME content type for Excel files (just a string, for our convenience)
import { MimeContentType_ExcelXlsx } from 'verifalia';

const file = document.getElementById('file').files[0];

const validation = await verifalia
    .emailValidations
    .submit({
        file: file,
        contentType: MimeContentType_ExcelXlsx,
        startingRow: 1,
        quality: 'high',
        deduplication: 'safe'
    }, true);
```

## Retrieving a job and its results

Once you have an email validation job Id, which is always returned by `submit()` as part of the validation's `overview` property, you can retrieve the job data using the `get()` method. Similarly to the submission process, you can either wait for the completion of the job here - by either specifying `true` or a `WaitingStrategy` instance as the second parameter - or just retrieve the current job snapshot to get its progress. Only completed jobs have their `entries` filled with the email validation results, however.

In the following example, we are requesting the current snapshot of a given email validation job from Verifalia.
Async/await syntax:

```ts
const validation = await verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9');

if (validation.overview.status === ValidationStatus.Completed) {
	// validation.entries will have the validation results!
}
else {
	// What about having a coffee?
}
```

And using the promise callback syntax:

```ts
verifalia
    .emailValidations
	.get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9')
	.then(validation => {
		if (validation.overview.status === ValidationStatus.Completed) {
			// validation.entries will have the validation results!
		}
		else {
			// What about having a coffee?
		}
	});
```

And here is how to request the same job, asking the library to automatically wait for us until the job is completed (that is, _joining_ the job). Here with the async/await syntax:

```ts
const validation = await verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9', true);
```

And here using the promise callback syntax:

```ts
verifalia
    .emailValidations
	.get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9', true)
	.then(validation => {
		// TODO: Let's party!
	});
```

### How export a human-readable report of the verification result ###

Once an email verification job is completed, it is also possible to retrieve a human-readable report of its results as either a comma-separated values (.csv) file or as a Microsoft Excel spreadsheet (.xls and .xlsx supported). While the output schema (columns / labels / data format) of the exported results is fairly mature and complete, you should consider it as subject to change: always [retrieve your results data using the `get()` method as explained above](#retrieving-a-job-and-its-results) if you need to deal with it in an unmanned way.

Here is an example showing how to export a completed email verification job as a Microsoft Excel file, given its job ID, in Node.js:

```ts
// Import the MIME content type for Excel files (just a string, for our convenience)
import { MimeContentType_ExcelXlsx } from 'verifalia/node/esm/index.mjs';

(
	await verifalia
    	.emailValidations
    	.export('dc21630a-6773-4bd0-b248-15e8b50c0d3e', MimeContentType_ExcelXlsx)
).pipe(fs.createWriteStream('/home/lbanfi/my-list.xls'))
```

And here is how to export the same completed email verification job as a comma-separated values (CSV) file in the browser, showing its content in an `iframe`:

```html
<!-- This is a the element which will hold the CSV export contents -->
<div id="my-iframe"></div>
```
```ts
// Import the MIME content type for CSV files (just a string, for our convenience)
import { MimeContentType_TextCsv } from 'verifalia';

const target = document.getElementByID('my-iframe');
const exportedData = await verifalia
	.emailValidations
	.export('dc21630a-6773-4bd0-b248-15e8b50c0d3e', MimeContentType_TextCsv);

target.src = exportedData.toBlobURL(MimeContentType_TextCsv);
```

## Don't forget to clean up, when you are done ##

Verifalia automatically deletes completed jobs after the data retention period eventually specified along with the submission options, falling back to the configured data retention period of the submitting user / browser app and, should it be unset, to the configured data retention period of the Verifalia account, with a default of 30 days.
It is always possible to delete completed jobs at any time, however, and deleting completed jobs is a best practice, for privacy and security reasons. To delete a completed email validation job, you can invoke the `delete()` method passing the job Id you wish to get rid of. Here is an example showing how to do that using the async/await syntax:

```ts
await verifalia
    .emailValidations
    .delete(validation.id);
```

And here is the same example using the promise callback syntax:

```ts
verifalia
    .emailValidations
	.delete(validation.id)
	.then(() => {
		// ...
	});
```

Once deleted, a job is gone and there is no way to retrieve its email validation(s).

# Managing credits #

To manage the Verifalia credits for your account you can use the `credits` property exposed by the `VerifaliaRestClient` instance created above.

## Getting the credits balance ##

One of the most common tasks you may need to perform on your Verifalia account is retrieving the available number of free daily credits and credit packs. To do that, you can use the `getBalance()` method, which returns a `Balance` object, as shown in the next example:

```ts
const balance = await verifalia
    .credits
    .getBalance();

console.log('Credit packs', balance.creditPacks);
console.log('Free daily credits', balance.freeCredits);
console.log('Free daily credits will reset in', balance.freeCreditsResetIn);

// Credit packs 956.332
// Free daily credits 128.66
// Free daily credits will reset in 09:08:23
```

To add credit packs to your Verifalia account visit [https://verifalia.com/client-area#/credits/add][5].

## Retrieving credits usage statistics ##

As a way to monitor and forecast the credits consumption for your account, the method `listDailyUsages()` allows to retrieve statistics about historical credits usage, returning an asynchronously iterable collection of `DailyUsage` instances. The method also allows to limit the period of interest by passing a `DailyUsageListingOptions` instance. Elements are returned only for the dates where consumption (either of free credits, credit packs or both) occurred.

Here is how to retrieve the daily credits consumption for a certain period:

```javascript
const dailyUsages = verifalia
    .credits
    .listDailyUsages({
		// from, to
		dateFilter = new DateBetweenPredicate(new Date('2021-10-09'), new Date('2021-11-08'))
	});

for await (const dailyUsage of dailyUsages) {
	console.log(dailyUsage.date);
	console.log('\tCredit packs', dailyUsage.creditPacks);
	console.log('\tFree daily credits', dailyUsage.freeCredits);
}

// Prints out something like:
// Sat Oct 10 2021
//     Credit packs 1965.68
//     Free daily credits 200
// Mon Oct 12 2021
//     Credit packs 0
//     Free daily credits 185.628
// Tue Oct 13 2021
//     Credit packs 15.32
//     Free daily credits 200
// ...
```

[0]: https://verifalia.com
[2]: https://verifalia.com/developers#authentication
[3]: https://verifalia.com/client-area#/users/new
[4]: https://verifalia.com/sign-up
[5]: https://verifalia.com/client-area#/credits/add
[6]: https://nodejs.org/api/esm.html