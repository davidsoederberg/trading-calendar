Trading Calendar
=======================================

![Build](https://github.com/davidsoederberg/trading-calendar/workflows/Node.js%20CI/badge.svg?branch=main) 
![npm](https://img.shields.io/npm/v/trading-calendar)
![licence](https://img.shields.io/npm/l/trading-calendar)

A NodeJS library that allows you to check if an exchange is open or closed. You can check if the market is trading today and if the trading session is live right now. You can also check historical and futures dates with the condition that the year is supported. Create multiple exchange objects to check status of multiple exchanges easily.

Feel free to contribute with adding more exchanges and years.

## List of features

*   Check if trading today
*   Check if trading right now
*   Check if trading at specific date (with or without time)

## Supported exchanges

* Stockholm

## Supported years

* 2021

## Installation

```shell 
$ npm install trading-calendar 
```

## Code Example

```js 
const { exchange } = require('trading-calendar');

const stockholm = exchange('stockholm');
if(stockholm.isTradingNow()){
  // Stockholm is open right now
} else {
  // Stockholm is closed right now
}
```

## Documentation

Get all supported exchanges
```js
const { supportedExchanges } = require('trading-calendar');

console.log(supportedExchanges); // => [ 'stockholm' ]
```
Create an ```Exchange``` object (Check supported exchanges for valid input)
```js 
const { exchange } = require('trading-calendar');

const stockholm = exchange('stockholm');
```
Example of an ```Exchange``` object:
```js
Exchange {
  name: 'stockholm',
  timezone: 'Europe/Stockholm',
  openTime: { hour: 9, minute: 0 },
  closeTime: { hour: 17, minute: 30 },
  calendar: {
    '2021': {
      January: [Array],
      April: [Array],
      May: [Array],
      June: [Array],
      December: [Array]
    }
  }
}
```
Explanation:
* ```name``` - name of exchange
* ```timezone``` - timezone of exchange
* ```openTime``` - local opening time of exchange
* ```closeTime``` - local closeing time of exchange
* ```calendar``` - calendar strucutre of the days that the exchange is closed

Functions of an ```Exchange``` object:

* ```isTradingToday(): boolean```
* ```isTradingNow(): boolean```
* ```isTradingDay(date: string | Date | DateTime): boolean```
* ```isTradingTime(date: string | Date | DateTime): boolean```

```isTradingToday(): boolean``` - Check if the exchange will be open today
```js
const { exchange } = require('trading-calendar');

const stockholm = exchange('stockholm');
if(stockholm.isTradingToday()){
  // Stockholm is open today
} else {
  // Stockholm is closed today
}
```
```isTradingNow(): boolean``` - Check if the exchange is open right now
```js
const { exchange } = require('trading-calendar');

const stockholm = exchange('stockholm');
if(stockholm.isTradingNow()){
  // Stockholm is open right now
} else {
  // Stockholm is closed right now
}
```
```isTradingDay(date: string | Date | DateTime): boolean``` - Check if the exchange was / will be open at a specific date. The function can take three different inputs. String should be in the format ```yyyy-mm-dd```. ```Date``` is the standard Javascript object. ```DateTime``` is an object created by the package [Luxon](https://moment.github.io/luxon/).
```js
const { DateTime } = require('luxon');
const { exchange } = require('trading-calendar');

// Example of all three
const stringDate = '2021-08-11';
// const date = new Date('2021-08-11');
// const time = DateTime.fromFormat('2021-08-11', 'yyyy-MM-dd');

const stockholm = exchange('stockholm');
if(stockholm.isTradingDay(stringDate)){
  // Stockholm is open at the date 2021-08-11
} else {
  // Stockholm is closed at the date 2021-08-11
}
```

```isTradingTime(date: string | Date | DateTime): boolean``` - Check if the exchange was / will be open at a specific date including time. The function can take three different inputs. String should be in the format ```yyyy-mm-dd-HH24:MI```. ```Date``` is the standard Javascript object. ```DateTime``` is an object created by the package [Luxon](https://moment.github.io/luxon/).
```js
const { DateTime } = require('luxon');
const { exchange } = require('trading-calendar');

// Example of all three
const stringTime = '2021-08-11-14:30';
// const date = new Date('2021-08-11');
// date.setHours(14);
// date.setMinutes(30);
// time = DateTime.fromFormat('2021-08-11-14:30', 'yyyy-MM-dd-HH:mm');

const stockholm = exchange('stockholm');
if(stockholm.isTradingTime(stringTime)){
  // Stockholm is open at the date + time 2021-08-11-14:30
} else {
  // Stockholm is closed at the date + time 2021-08-11-14:30
}
```

## Tests

Unit testing with Jest. Run with:
```shell
$ npm test
```

## Contributing

Feel free to add more features or fix bugs 

Adding support for more exchanges and years is also appreciated.

## Author

*   David Söderberg

## License

This project is licensed under the MIT License
