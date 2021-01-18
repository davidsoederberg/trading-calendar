import { DateTime } from 'luxon';
const { exchange, supportedExchanges } = require('../index');
const supportedYears = ['2021'];

const stockholm = exchange('stockholm');
const oslo = exchange('oslo');
const newYork = exchange('new-york');
const exchanges = [stockholm, oslo, newYork];

test('supported exchanges', () => {
  expect(supportedExchanges).toEqual(['stockholm', 'oslo', 'new-york']);
});

test('that exchanges had the correct info from exchanges.json', () => {
  for (const exchange of exchanges) {
    expect(exchange).toHaveProperty('name');
    expect(exchange).toHaveProperty('timezone');
    expect(exchange).toHaveProperty('openTime');
    expect(exchange).toHaveProperty('closeTime');
    expect(exchange).toHaveProperty('calendar');
    for(const year of supportedYears) {
      expect(exchange.calendar).toHaveProperty(year);
    }
  }
});

test('time with string - incorrect format', () => {
  expect(() => { stockholm.isTradingTime('2021/01/01-20:30'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2021-01-01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2021-08-11:25:67'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2022-08-11:25:67'); }).toThrow(Error);
});
test('time with string - correct format', () => {
  expect(typeof stockholm.isTradingNow() === 'boolean').toBe(true);
  expect(stockholm.isTradingTime('2021-01-01-20:30')).toBe(false);
  expect(stockholm.isTradingTime('2021-05-13-14:30')).toBe(false);
  expect(oslo.isTradingTime('2021-08-11-16:25')).toBe(false);
  expect(stockholm.isTradingTime('2021-08-11-17:29')).toBe(true);
  expect(stockholm.isTradingTime('2021-08-11-08:59')).toBe(false);
  expect(stockholm.isTradingTime('2021-08-11-09:00')).toBe(true);
  expect(newYork.isTradingTime('2021-08-11-09:29')).toBe(false);
});
test('time with Date object', () => {
  let date = new Date('2021-08-11');
  date.setHours(8);
  date.setMinutes(59);
  expect(stockholm.isTradingTime(date)).toBe(false);
  date.setHours(9);
  date.setMinutes(0);
  expect(stockholm.isTradingTime(date)).toBe(true);
  date.setHours(14);
  date.setMinutes(30);
  expect(stockholm.isTradingTime(date)).toBe(true);
  date.setHours(17);
  date.setMinutes(29);
  expect(stockholm.isTradingTime(date)).toBe(true);
  date.setHours(17);
  date.setMinutes(30);
  expect(stockholm.isTradingTime(date)).toBe(false);
  date = new Date('2021-04-02');
  date.setHours(14);
  date.setMinutes(30);
  expect(stockholm.isTradingTime(date)).toBe(false);
});
test('time with DateTime object', () => {
  let time = DateTime.fromFormat('2021-08-11-08:59', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(false);
  time = DateTime.fromFormat('2021-08-11-09:00', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(true);
  time = DateTime.fromFormat('2021-08-11-14:30', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(true);
  time = DateTime.fromFormat('2021-08-11-17:29', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(true);
  time = DateTime.fromFormat('2021-08-11-17:30', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(false);
  time = DateTime.fromFormat('2021-04-02-13:29', 'yyyy-MM-dd-HH:mm');
  expect(stockholm.isTradingTime(time)).toBe(false);
});

test('day with string - incorrect format', () => {
  expect(() => { stockholm.isTradingDay('2021/01/01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-01-2'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-13-11'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2022-08-11:25:67'); }).toThrow(Error);
});
test('day with string - correct format', () => {
  expect(typeof stockholm.isTradingToday() === 'boolean').toBe(true);
  expect(stockholm.isTradingDay('2021-04-02')).toBe(false);
  expect(stockholm.isTradingDay('2021-01-17')).toBe(false);
  expect(stockholm.isTradingDay('2021-08-11')).toBe(true);
});
test('day with Date object', () => {
  let date = new Date('2021-08-11');
  expect(stockholm.isTradingDay(date)).toBe(true);
  date = new Date('2021-01-01');
  expect(stockholm.isTradingDay(date)).toBe(false);
  date = new Date('2021-01-17');
  expect(stockholm.isTradingDay(date)).toBe(false);
});
test('day with DateTime object', () => {
  let time = DateTime.fromFormat('2021-08-11', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(true);
  time = DateTime.fromFormat('2021-04-02', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(false);
  time = DateTime.fromFormat('2021-01-17', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(false);
});

test('wrong name on exchange or exchange not available', () => {
  expect(() => { exchange('not_a_name_of_an_exchange'); }).toThrow(Error);
});
