import { DateTime } from 'luxon';
import tradingCalendar from '../index';
const currentExchanges = ['stockholm']

tradingCalendar.availableExchanges();
test('Available exchanges', () => {
  expect(tradingCalendar.availableExchanges()).toEqual(currentExchanges);
});

const stockholm = tradingCalendar.exchange('stockholm');

test('Exchange information test', () => {
  expect(stockholm.getName()).toEqual('stockholm');
  expect(stockholm.getTimezone()).toEqual('Europe/Stockholm');
  expect(stockholm.getOpenTime()).toEqual({hour: 9, minute: 0});
  expect(stockholm.getCloseTime()).toEqual({hour: 17, minute: 30});
});

test('Exchange time tests with string to have incorrect format', () => {
  expect(() => { stockholm.isTradingTime('2021/01/01-20:30'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2021-01-01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2021-08-11:25:67'); }).toThrow(Error);
  expect(() => { stockholm.isTradingTime('2022-08-11:25:67'); }).toThrow(Error);
});
test('Exchange time tests with string to have correct format', () => {
  expect(typeof stockholm.isTradingNow() === 'boolean').toBe(true);
  expect(stockholm.isTradingTime('2021-01-01-20:30')).toBe(false);
  expect(stockholm.isTradingTime('2021-05-13-14:30')).toBe(false);
  expect(stockholm.isTradingTime('2021-08-11-17:30')).toBe(false);
  expect(stockholm.isTradingTime('2021-08-11-17:29')).toBe(true);
  expect(stockholm.isTradingTime('2021-08-11-08:59')).toBe(false);
  expect(stockholm.isTradingTime('2021-08-11-09:00')).toBe(true);
  expect(stockholm.isTradingTime('2021-08-11-14:47')).toBe(true);
});
test('Exchange time test with Date', () => {
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
test('Exchange time test with DateTime', () => {
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

test('Exchange day tests with string to have incorrect format', () => {
  expect(() => { stockholm.isTradingDay('2021/01/01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-01'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-01-2'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2021-13-11'); }).toThrow(Error);
  expect(() => { stockholm.isTradingDay('2022-08-11:25:67'); }).toThrow(Error);
});
test('Exchange day tests with string to have correct format', () => {
  expect(typeof stockholm.isTradingToday() === 'boolean').toBe(true);
  expect(stockholm.isTradingDay('2021-04-02')).toBe(false);
  expect(stockholm.isTradingDay('2021-01-17')).toBe(false);
  expect(stockholm.isTradingDay('2021-08-11')).toBe(true);
});
test('Exchange day test with Date', () => {
  let date = new Date('2021-08-11');
  expect(stockholm.isTradingDay(date)).toBe(true);
  date = new Date('2021-01-01');
  expect(stockholm.isTradingDay(date)).toBe(false);
  date = new Date('2021-01-17');
  expect(stockholm.isTradingDay(date)).toBe(false);
});
test('Exchange day test with DateTime', () => {
  let time = DateTime.fromFormat('2021-08-11', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(true);
  time = DateTime.fromFormat('2021-04-02', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(false);
  time = DateTime.fromFormat('2021-01-17', 'yyyy-MM-dd');
  expect(stockholm.isTradingDay(time)).toBe(false);
});

test('Wrong name on exchange / exchange not available', () => {
  expect(() => { tradingCalendar.exchange('not_a_name_of_an_exchange'); }).toThrow(Error);
});
