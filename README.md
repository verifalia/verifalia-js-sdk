![Verifalia API](https://img.shields.io/badge/Verifalia%20API-v2.0-green)
[![NPM](https://img.shields.io/npm/v/verifalia.svg)](https://www.npmjs.com/package/verifalia)

Verifalia REST API - SDK and helper library for Javascript
==========================================================

[Verifalia][0] provides a simple HTTPS-based API for validating email addresses in real-time and checking whether they are deliverable or not; this SDK library integrates with Verifalia and allows to [verify email addresses][0] on Node.js backends.

## Adding Verifalia REST API support to your Node.js project ##

The best and easiest way to add the Verifalia email verification Javascript library to your Node.js project is to use [npm](https://npmjs.org/), which will automatically download and install the required files. With npm installed, run the following from your project root:

```bash
$ npm install verifalia
```

### Supported module systems ###

This library supports the following module systems out of the box:

#### Native ES6 / ES2015 module ####

This is the most modern approach but support in Node.js is [still experimental][6]; using the features of this library requires
the use of the `import` keyword, as shown below:

```javascript
import { VerifaliaRestClient } from 'verifalia';
```

A build artifact with a native ES6 / ES2015 module is distributed in the `dist/es2015` folder.

#### UMD - Universal Module Definition ####

Still a widely used apporach, using this loading method you can use the features of this library through
the `require` function, as shown below:

```javascript
const { VerifaliaRestClient } = require('verifalia');
```

The build artifact with the UMD module is available in the `dist/umd` folder.

### Authentication ###

First things first: authentication to the Verifalia API is performed by way of either the credentials of your root Verifalia account or of one of its users (previously known as sub-accounts): if you don't have a Verifalia account, just [register for a free one][4]. For security reasons, it is always advisable to [create and use a dedicated user][3] for accessing the API, as doing so will allow to assign only the specific needed permissions to it.

Learn more about authenticating to the Verifalia API at [https://verifalia.com/developers#authentication][2]

Once you have your Verifalia credentials at hand, use them while creating a new instance of the `VerifaliaRestClient` class, which will be the starting point to every other operation against the Verifalia API:

```javascript
import { VerifaliaRestClient } from 'verifalia';

const verifalia = new VerifaliaRestClient({
	username: 'username',
	password: 'password'
});
```

## Validating email addresses ##

Every operation related to verifying / validating email addresses is performed through the `emailValidations` property exposed by the `VerifaliaRestClient` instance you created above. The property is filled with useful methods: in the next few paragraphs we are looking at the most used ones, so it is strongly advisable to explore the library and look for other integration opportunities.

### How to validate an email address ###

To validate an email address from a Node.js application you can invoke the `submit()` method: it accepts one or more email addresses and any eventual verification options you wish to pass to Verifalia, including the expected results quality, deduplication preferences and processing priority.

In the next example, we are showing how to verify a single email address using this library and automatically wait for the job completion by passing a `true` value. For more advanced waiting scenarios and progress notifications, you can also pass an instance of the `WaitingStrategy` class.

```javascript
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

### How to validate a list of email addresses ###

As an alternative to method above, you can avoid automatically waiting and retrieve the email validation results at a later time; this is preferred in the event you are verifying a list of email addresses, which could take minutes or even hours to complete.

Here is how to do that:

```javascript
const validation = await verifalia
    .emailValidations
    .submit([{
		"batman@gmail.com",
		"steve.vai@best.music",
		"samantha42@yahoo.de"
	}]);

console.log('Job Id', validation.overview.id);
console.log('Status', validation.overview.status);

// Prints out something like:
// Job Id 290b5146-eeac-4a2b-a9c1-61c7e715f2e9
// Status InProgress
```

Once you have an email validation job Id, which is always returned by `submit()` as part of the validation's `overview` property, you can retrieve the job data using the `get()` method. Similarly to the submission process, you can either wait for the completion of the job or just retrieve the current job snapshot to get its progress. Only completed jobs have their `entries` filled with the email validation results, however.

In the following example, we are requesting the current snapshot of a given email validation job back from Verifalia:

```javascript
const validation = await verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9');

if (validation.overview.status === ValidationStatus.Completed)
{
	// validation.entries will have the validation results!
}
else
{
	// What about having a coffee?
}
```

And here is how to request the same job, asking the SDK to automatically wait for us until the job is completed (that is, _joining_ the job):

```javascript
const validation = await verifalia
    .emailValidations
    .get('290b5146-eeac-4a2b-a9c1-61c7e715f2e9', true);
```

### Don't forget to clean up, when you are done ###

Verifalia automatically deletes completed jobs after 30 days since their completion: deleting completed jobs is a best practice, for privacy and security reasons. To do that, you can invoke the `delete()` method passing the job Id you wish to get rid of:

```javascript
await verifalia
    .emailValidations
    .delete(validation.id);
```

Once deleted, a job is gone and there is no way to retrieve its email validation(s).

## Managing credits ##

To manage the Verifalia credits for your account you can use the `credits` property exposed by the `VerifaliaRestClient` instance created above. Like for the previous topic, in the next few paragraphs we are looking at the most used operations, so it is strongly advisable to explore the library and look for other opportunities.

### Getting the credits balance ###

One of the most common tasks you may need to perform on your account is retrieving the available number of free daily credits and credit packs. To do that, you can use the `getBalance()` method, which returns a `Balance` object, as shown in the next example:

```javascript
var balance = await verifalia
    .credits
    .getBalance();

console.log('Credit packs', balance.creditPacks);
console.log('Free daily credits', balance.freeCredits);
console.log('Free daily credits will reset in', balance.freeCreditsResetIn);

// Prints out something like:
// Credit packs 956.332
// Free daily credits 128.66
// Free daily credits will reset in 09:08:23
```

To add credit packs to your Verifalia account visit [https://verifalia.com/client-area#/credits/add][5].

### Retrieving credits usage statistics ###

As a way to monitor and forecast the credits consumption for your account, the method `listDailyUsages()` allows to retrieve statistics about historical credits usage, returning an asynchronously iterable collection of `DailyUsage` instances. The method also allows to limit the period of interest by passing a `DailyUsageListingOptions` instance. Elements are returned only for the dates where consumption (either of free credits, credit packs or both) occurred.

Here is how to retrieve the daily credits consumption for a certain period:

```javascript
const dailyUsages = verifalia
    .credits
    .listDailyUsages({
		dateFilter = new DateBetweenPredicate
		{
			since = new Date('2019-07-09'),
			until = new Date('2019-08-16'),
		}
	});

for await (const dailyUsage of dailyUsages) {
	console.log(dailyUsage.date);
	console.log('\tCredit packs', dailyUsage.creditPacks);
	console.log('\tFree daily credits', dailyUsage.freeCredits);
}

// Prints out something like:
// Thu Aug 01 2019
//     Credit packs 1965.68
//     Free daily credits 200
// Wed Jul 31 2019
//     Credit packs 0
//     Free daily credits 185.628
// Mon Jul 29 2019
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