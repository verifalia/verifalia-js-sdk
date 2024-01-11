![Verifalia API](https://img.shields.io/badge/Verifalia%20API-v2.5-green)
[![NPM](https://img.shields.io/npm/v/verifalia.svg)](https://www.npmjs.com/package/verifalia)

Verifalia REST API - SDK and helper library for Javascript
==========================================================

[Verifalia][0] provides a fast and accurate API for verifying email addresses in real-time and checking whether they are deliverable, invalid, or otherwise risky: this SDK library integrates with Verifalia and allows to [verify email addresses][0] on both Node.js backends and in the browser. 

It includes artifacts for a wide range of module loaders, including CommonJS (suitable for Node.js) and native ES modules (ideal for modern front-end module bundlers like Webpack and Rollup, for front-end frameworks like Angular, React, Vue, etc. - and supported in Node.js v13+); it also comes with a turn-key single-file IIFE for browsers (compatible with ES5 or higher), with no external dependencies.

To learn more about Verifalia please see [https://verifalia.com][0]

## Table of contents

- [Getting started](#getting-started)
  * [Install the package](#install-the-package)
  * [Using Verifalia in Node.js](#using-verifalia-in-nodejs)
    + [CommonJS (default in Node.js)](#commonjs--default-in-nodejs-)
    + [ES modules (available in Node.js v13 and higher)](#es-modules--available-in-nodejs-v13-and-higher-)
  * [Using Verifalia in the browser](#using-verifalia-in-the-browser)
    + [ES modules (ideal for: Webpack, Rollup, ..., Angular, React, Vue, ...)](#es-modules--ideal-for--webpack--rollup----angular--react--vue---)
    + [CommonJS](#commonjs)
    + [AMD](#amd)
    + [IIFE (single-file, which can be directly included in web-pages as is)](#iife--single-file--which-can-be-directly-included-in-web-pages-as-is-)
  * [Authentication](#authentication)
    + [Browser apps' keys](#browser-apps--keys)
    + [Authenticating via X.509 client certificate (Node-only)](#authenticating-via-x509-client-certificate--node-only-)
- [Validating email addresses](#validating-email-addresses)
  * [How to validate an email address](#how-to-validate-an-email-address)
  * [How to validate a list of email addresses](#how-to-validate-a-list-of-email-addresses)
  * [How to import and submit a file for validation](#how-to-import-and-submit-a-file-for-validation)
  * [Processing options](#processing-options)
    + [Quality level](#quality-level)
    + [Deduplication mode](#deduplication-mode)
    + [Data retention](#data-retention)
    + [Wait options](#wait-options)
      - [Avoid waiting](#avoid-waiting)
      - [Progress tracking](#progress-tracking)
    + [Completion callbacks](#completion-callbacks)
  * [Retrieving a job and its results](#retrieving-a-job-and-its-results)
  * [Exporting email verification results in different output formats](#exporting-email-verification-results-in-different-output-formats)
  * [Don't forget to clean up, when you are done](#don-t-forget-to-clean-up--when-you-are-done)
- [Managing credits](#managing-credits)
  * [Getting the credits balance](#getting-the-credits-balance)
  * [Retrieving credits usage statistics](#retrieving-credits-usage-statistics)
- [Changelog / What's new](#changelog---what-s-new)
  * [v4.1](#v41)
  * [v4.0](#v40)

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
				.submit('batman@gmail.com')
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

Every operation related to verifying / validating email addresses is performed through the `emailValidations` property exposed by the `VerifaliaRestClient` instance you created above. The property contains references to methods which can be used to verify email addresses and manage past emaiil validation jobs, as explained below.

**The library automatically waits for the completion of email verification jobs**: if needed, it is possible to adjust the wait options and have more control over the entire underlying polling process. Please refer to the [Wait options](#wait-options) section below for additional details.

## How to validate an email address ##

To validate an email address you can invoke the `submit()` method: it accepts one or more email addresses and any eventual verification options you wish to pass to Verifalia, including the expected results quality, deduplication preferences and processing priority.

> **Note**
> In the event you need to verify a list of email addresses, it is advisable to submit them all at once through an
> array of strings or through a `ValidationRequest` / `FileValidationRequest` object (see the next sections), instead of iterating over the
> source set and submitting the addresses one by one. Not only the all-at-once method would be faster, it would
> also allow to detect and mark duplicated items - a feature which is unavailable while verifying the email addresses
> one by one.

In the next example, you can see how to verify an email address using the default options, with the async/await pattern;
for more advanced waiting scenarios and progress tracking, you can also pass an instance of the `WaitOptions` class.

```ts
const result = await verifalia
    .emailValidations
    .submit('batman@gmail.com');

// At this point the address has been validated: let's print
// its email validation result to the console.

const entry = result.entries[0];
console.log(`${entry.classification} (${entry.status})`);

// Prints out something like:
// Deliverable (Success)
```

Of course, you can use the promise callback pattern if your platform does not support the async/await pattern:

```ts
verifalia
    .emailValidations
    .submit('batman@gmail.com')
    .then(result => {
        // At this point the address has been validated: let's print
        // its email validation result to the console.

        const entry = result.entries[0];
        console.log(`${entry.classification} (${entry.status})`);

        // Prints out something like:
        // Deliverable (Success)
    });
```

As you may expect, each entry may include various additional details about the verified email address:

| Field                         | Description                                                                                                                                                                                                                                                  |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `asciiEmailAddressDomainPart` | Gets the domain part of the email address, converted to ASCII if needed and with comments and folding white spaces stripped off.                                                                                                                             |
| `classification`              | The classification value for this entry; values known at the time this SDK is released are available through the `ValidationEntryClassification_*` constants.                                                                                                |
| `completedOn`                 | The date this entry has been completed, if available.                                                                                                                                                                                                        |
| `custom`                      | A custom, optional string which is passed back upon completing the validation. To pass back and forth a custom value, use the `custom` field of the specific submitted entry.                                                                                |
| `duplicateOf`                 | The zero-based index of the first occurrence of this email address in the parent validation job, in the event the `status` for this entry is `Duplicate`; duplicated items do not expose any result detail apart from this and the eventual `custom` values. |
| `index`                       | The index of this entry within its validation job; this property is mostly useful in the event the API returns a filtered view of the items.                                                                                                                 |
| `inputData`                   | The input string being validated.                                                                                                                                                                                                                            |
| `emailAddress`                | Gets the email address, without any eventual comment or folding white space. Returns null if the input data is not a syntactically invalid e-mail address.                                                                                                   |
| `emailAddressDomainPart`      | Gets the domain part of the email address, without comments and folding white spaces.                                                                                                                                                                        |
| `emailAddressLocalPart`       | Gets the local part of the email address, without comments and folding white spaces.                                                                                                                                                                         |
| `hasInternationalDomainName`  | If true, the email address has an international domain name.                                                                                                                                                                                                 |
| `hasInternationalMailboxName` | If true, the email address has an international mailbox name.                                                                                                                                                                                                |
| `isDisposableEmailAddress`    | If true, the email address comes from a disposable email address (DEA) provider. <a href="https://verifalia.com/help/email-validations/what-is-a-disposable-email-address-dea">What is a disposable email address?</a>                                       |
| `isFreeEmailAddress`          | If true, the email address comes from a free email address provider (e.g. gmail, yahoo, outlook / hotmail, ...).                                                                                                                                             |
| `isRoleAccount`               | If true, the local part of the email address is a well-known role account.                                                                                                                                                                                   |
| `status`                      | The status value for this entry; values known at the time this SDK is released are available through the `ValidationEntryStatus_*` constants.                                                                                                                |                                                                                                                                                                                                                             
| `suggestions`                 | The potential corrections for the input data, in the event Verifalia identified potential typos during the verification process.                                                                                                                             |
| `syntaxFailureIndex`          | The position of the character in the email address that eventually caused the syntax validation to fail.                                                                                                                                                     |

Here is another example, showing some of the additional result details provided by Verifalia:

```js
const result = await verifalia
    .emailValidations
    .submit('bat[man@gmal.com');

const entry = result.entries[0];

console.log(`Classification: ${entry.classification}`);
console.log(`Status: ${entry.status}`);
console.log(`Syntax failure index: ${entry.syntaxFailureIndex}`);

if (entry.suggestions) {
    console.log('Suggestions:');

    entry.suggestions.forEach(suggestion => {
        console.log(`- ${suggestion}`);
    });
}

// Classification: Undeliverable
// Status: InvalidCharacterInSequence
// Syntax failure index: 3
// Suggestions:
// - batman@gmail.com
```

## How to validate a list of email addresses ##

To verify a list of email addresses - instead of a single address - it is possible to pass an array of strings
to `submit()`; if the email addresses to be verified are originally stored
in a file, it is also possible to simply upload the file and have Verifalia automatically import and verify
it (see the next section for the details).

Here is an example showing how to verify an array with some email addresses, using the async/await pattern:

```ts
const result = await verifalia
    .emailValidations
    .submit([
        'batman@gmail.com',
        'steve.vai@best.music',
        'samantha42@yahoo.de'
    ]);

result.entries.forEach(item => {
    console.log(`${item.inputData}: ${item.classification}`);
});
```

And here, of course, the promise callback syntax version of the same:

```ts
// Submit the list first

verifalia
    .emailValidations
    .submit([
        'batman@gmail.com',
        'steve.vai@best.music',
        'samantha42@yahoo.de'
    ])
    .then(result => {
        result.entries.forEach((item) => {
            console.log(`${item.inputData}: ${item.classification}`);
        });
    });
```

## How to import and submit a file for validation

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

const result = await verifalia
    .emailValidations
    .submit({
        file: file,
        contentType: MimeContentType_ExcelXlsx,
        startingRow: 1,
        quality: 'high',
        deduplication: 'safe'
    });
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

const result = await verifalia
    .emailValidations
    .submit({
        file: file,
        contentType: MimeContentType_ExcelXlsx,
        startingRow: 1,
        quality: 'high',
        deduplication: 'safe'
    });
```

## Processing options

While submitting one or more email addresses for verification, it is possible to specify several
options which affect the behavior of the Verifalia processing engine as well as the verification flow
from the API consumer standpoint.

### Quality level

Verifalia offers three distinct quality levels - namely, _Standard_, _High_ and _Extreme_  - which rule out how the email verification engine should
deal with temporary undeliverability issues, with slower mail exchangers and other potentially transient
problems which can affect the quality of the verification results. The `submit()` method accepts a `ValidationRequest` (or
a `FileValidationRequest`, for file imports), where the `quality` field allows
to specify the desired quality level; here is an example showing how to verify an email address using
the _High_ quality level:

```ts
const validation = await verifalia
    .emailValidations
    .submit({
        entries: [
            {
                inputData: 'batman@gmail.com'
            }
        ],
        quality: 'high'
    });
```

### Deduplication mode

`ValidationRequest` (or `FileValidationRequest`, for file imports) also allows to specify how to
deal with duplicated entries pertaining to the same input set; Verifalia supports a _Safe_ deduplication
mode, which strongly adheres to the old IETF standards, and a _Relaxed_ mode which is more in line with
what can be found in the majority of today's mail exchangers configurations.

In the next example, we show how to import and verify a list of email addresses in Node.js and mark duplicated
entries using the _Relaxed_ deduplication mode:

```ts
import { MimeContentType_ExcelXlsx } from 'verifalia/node/esm/index.mjs';

const file = fs.createReadStream('/home/john/sample.xlsx');

const validation = await verifalia
    .emailValidations
    .submit({
        file: file,
        contentType: MimeContentType_ExcelXlsx,
        startingRow: 1,
        quality: 'high',
        deduplication: 'relaxed'
    });
```

### Data retention

Verifalia automatically deletes completed email verification jobs according to the data retention
policy defined at the account level, which can be eventually overriden at the user level: one can
use the [Verifalia clients area](https://verifalia.com/client-area) to configure these settings.

It is also possible to specify a per-job data retention policy which govern the time to live of a submitted
email verification job; to do that, specify a `retention` value through the passed `ValidationRequest` (or `FileValidationRequest`, for file imports) instance.

Here is how, for example, one can set a data retention policy of 10 minutes while verifying
an email address:

```ts
const validation = await verifalia
    .emailValidations
    .submit({
        entries: [
            {
                inputData: 'batman@gmail.com'
            }
        ],
        retention: '0:10:0' // 10 minutes
    });
```

### Wait options

By default, the `submit()` method submits an email verification job to Verifalia and waits
for its completion; the entire process may require some time to complete depending on the plan of the
Verifalia account, the number of email addresses the submission contains, the specified quality level
and other network factors including the latency of the mail exchangers under test. 

In waiting for the completion of a given email verification job, the library automatically polls the
underlying Verifalia API until the results are ready; by default, it tries to take advantage of the long
polling mode introduced with the Verifalia API v2.4, which allows to minimize the number of requests
and get the verification results faster.

#### Avoid waiting

In certain scenarios (in a microservice architecture, for example), however, it may preferable to avoid
waiting for a job completion and ask the Verifalia API, instead, to just queue it: in that case, the library
would just return the job overview (and not its verification results) and it will be necessary to retrieve
the verification results using the `get()` method.

To do that, it is possible to specify the `WaitOptions.noWait` as the value for the `waitOptions` field
of the passed `ValidationRequest` (or `FileValidationRequest`, for file imports) instance, as shown in
the next example:

```ts
const job = await verifalia
    .emailValidations
    .submit('batman@gmail.com', WaitOptions.noWait);

console.log(`Status: ${job.Overview.Status}`);
// Status: InProgress
```

#### Progress tracking

For jobs with a large number of email addresses, it could be useful to track progress as they are processed
by the Verifalia email verification engine; to do that, it is possible to create an instance of the
`WaitOptions` class and provide an handler which eventually receives progress notifications through the
`progress` field.

Here is how to define a progress notification handler which displays the progress percentage of a submitted
job to the console window:

```ts
const result = await verifalia
    .emailValidations
    .submit([
        'batman@gmail.com',
        'steve.vai@best.music',
        'samantha42@yahoo.de'
    ], {
        ...new WaitOptions(),
        progress: jobOverview => {
            console.log(`% completed: ${jobOverview.progress?.percentage * 100}`);
        }
    });
```

### Completion callbacks

Along with each email validation job, it is possible to specify an URL which
Verifalia will invoke (POST) once the job completes: this URL must use the HTTPS or HTTP
scheme and be publicly accessible over the Internet.
To learn more about completion callbacks, please see https://verifalia.com/developers#email-validations-completion-callback

To specify a completion callback URL, pass either a `ValidationRequest` or a `FileValidationRequest`
to the `submit()` method and set its `callback.url` field accordingly, as shown
in the example below:

```ts
const validation = await verifalia
    .emailValidations
    .submit({
        entries: [
            {
                inputData: 'batman@gmail.com'
            }
        ],
        callback: {
            url: 'https://your-website-here/foo/bar'
        }
    });
```

Note that completion callbacks are invoked asynchronously and it could take up to
several seconds for your callback URL to get invoked.


## Retrieving a job and its results

It is possible to retrieve a job through the `get()` method, passing the required email verification job identifer.
While doing that, the library automatically waits for the completion of
the job, and it is possible to adjust this behavior by passing to the aforementioned methods
a `waitOptions` parameter, in the exactly same fashion as described for the `submit()` method; please see
the [Wait options](#wait-options) section for additional details.

In the next example, you can see how to retrieve an email verification job using the default options, with the async/await pattern:

```ts
const validation = await verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9');
```

And here is the same code, using the promise callback syntax:

```ts
verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9')
    .then(validation => {
        // ...
    });
```

## Exporting email verification results in different output formats

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

## Don't forget to clean up, when you are done

Verifalia automatically deletes completed jobs after the data retention period eventually specified along with the submission options, falling back to the configured data retention period of the submitting user / browser app and, should it be unset, to the configured data retention period of the Verifalia account, with a default of 30 days.
It is always possible to delete completed jobs at any time, however, and deleting completed jobs is a best practice, for privacy and security reasons.

To delete a completed email validation job, you can invoke the `delete()` method passing the job Id you wish to get rid of. Here is an example showing how to do that using the async/await syntax:

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

Once deleted, a job is gone and there is no way to retrieve its email validation results.

# Managing credits #

To manage the Verifalia credits for your account you can use the `credits` property exposed by the `VerifaliaRestClient` instance created above.

## Getting the credits balance ##

One of the most common tasks you may need to perform on your Verifalia account is retrieving the available number of free daily credits and credit packs. To do that, you can use the `getBalance()` method, which returns a `Balance` object, as shown in the next example:

```ts
const balance = await verifalia
    .credits
    .getBalance();

console.log(`Credit packs ${balance.creditPacks}`);
console.log(`Free daily credits ${balance.freeCredits}`);
console.log(`Free daily credits will reset in ${balance.freeCreditsResetIn}`);

// Credit packs 956.332
// Free daily credits 128.66
// Free daily credits will reset in 09:08:23
```

To add credit packs to your Verifalia account visit [https://verifalia.com/client-area#/credits/add][5].

## Retrieving credits usage statistics ##

As a way to monitor and forecast the credits consumption for your account, the method `listDailyUsages()` allows to retrieve statistics about historical credits usage, returning an asynchronously iterable collection of `DailyUsage` instances. The method also allows to limit the period of interest by passing a `DailyUsageListingOptions` instance. Elements are returned only for the dates where consumption (either of free credits, credit packs or both) occurred.

Here is how to retrieve the daily credits consumption for a certain period:

```js
const dailyUsages = verifalia
    .credits
    .listDailyUsages({
        // from, to
        dateFilter: new DateBetweenPredicate(new Date('2024-01-09'), new Date('2024-03-01'))
    });

for await (const dailyUsage of dailyUsages) {
    console.log(dailyUsage.date);
    console.log('\tCredit packs', dailyUsage.creditPacks);
    console.log('\tFree daily credits', dailyUsage.freeCredits);
}

// Prints out something like:
// Sat Jan 10 2024
//     Credit packs 1965.68
//     Free daily credits 200
// Mon Jan 12 2024
//     Credit packs 0
//     Free daily credits 185.628
// Tue Jan 13 2024
//     Credit packs 15.32
//     Free daily credits 200
// ...
```

# Changelog / What's new

This section lists the changelog for the current major version of the library: for older versions,
please see the [project releases](https://github.com/verifalia/verifalia-js-sdk/releases).

## v4.1

Released on January 11<sup>th</sup>, 2024

- Added support for API v2.5
- Added support for custom classification override rules
- Added support for suggestions / corrections
- Improved documentation

## v4.0

Released on March 2<sup>nd</sup>, 2023

- Added support for API v2.4
- Added support for new completion callback options
- Added support for parked mail exchangers detection
- Added support for specifying a custom wait time while submitting and retrieving email verification jobs
- Breaking change: renamed `WaitingStrategy` into `WaitOptions` and refactored the latter so that it now allows to
adjust the underlying polling wait times
- Breaking change: the default job submission and retrieval behavior is now to wait for the completion
of jobs (but it is possible to change that through the new `WaitOptions` class)
- Improved documentation

[0]: https://verifalia.com
[2]: https://verifalia.com/developers#authentication
[3]: https://verifalia.com/client-area#/users/new
[4]: https://verifalia.com/sign-up
[5]: https://verifalia.com/client-area#/credits/add
[6]: https://nodejs.org/api/esm.html