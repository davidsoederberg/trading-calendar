import { DateTime } from 'luxon';
import exchanges from './exchanges.json';

type Calendar = { [key: number]: { [key: string]: number[] } };

class Exchange {
  private name: string;
  private timezone: string;
  private openTime;
  private closeTime;
  private calendar: Calendar;

  constructor(name: string) {
    this.name = name;
    const exchangeInfo = exchanges[name as keyof typeof exchanges];
    if(!exchangeInfo) throw new Error('Incorrect exchange name or exchange not supported. Check the docs for supported exchanges. If you would like to add an exchange, create an issue on the github page');
    this.timezone = exchangeInfo.timezone;
    this.openTime = exchangeInfo.openTime;
    this.closeTime = exchangeInfo.closeTime;
    this.calendar = exchangeInfo.calendar;
  }
  isTradingToday(): boolean {
    return this.checkIfTradingDay(DateTime.local().setZone(this.timezone));
  }
  isTradingDay(date: string | Date | DateTime): boolean {
    if(typeof date === 'string') {
      const reg = /^(19|20)\d\d[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])$/;
      if(reg.test(date)) {
        return this.checkIfTradingDay(DateTime.fromFormat(date, 'yyyy-mm-dd'))
      } else {
        throw new Error(`Incorrect format on ${date}. The correct format is yyyy-mm-dd, for example 2021-08-11`);
      }
    }
    if(date instanceof Date) {
      return this.checkIfTradingDay(DateTime.fromJSDate(date));
    }
    if(date instanceof DateTime) {
      return this.checkIfTradingDay(date);
    }
    throw new Error(`Date:${date} must be of type string, Date or DateTime.`);
  }
  private checkIfTradingDay(localTime: DateTime): boolean {
    if (localTime.weekday > 5) return false;
    const months = this.calendar[localTime.year];
    if(!months) throw new Error(`${localTime.year} is unsupported. Feel free to add more support with creating an issue on the github page.`);
    if (months.hasOwnProperty(localTime.monthLong)) {
      return !months[localTime.monthLong].includes(localTime.day);
    }
    return true;
  }
  isTradingNow(): boolean {
    return this.checkIfTradingTime(DateTime.local().setZone(this.timezone));
  }
  isTradingTime(date: string | Date | DateTime): boolean {
    if(typeof date === 'string') {
      const reg = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])[-]([01][0-9]|2[0123])[:]([0-5][0-9])$/;
      if(reg.test(date)) {
        return this.checkIfTradingTime(DateTime.fromFormat(date, 'yyyy-MM-dd-HH:mm'));
      } else {
        throw new Error(`Incorrect format on ${date}. The corrrect format is yyyy-mm-dd-HH24-MI, for example 2021-08-11-20:30`);
      }
    }
    if(date instanceof Date) {
      return this.checkIfTradingTime(DateTime.fromJSDate(date));
    }
    if(date instanceof DateTime) {
      return this.checkIfTradingTime(date);
    }
    throw new Error(`Date:${date} must be of type string, Date or DateTime.`);
  }
  private checkIfTradingTime(localTime: DateTime): boolean {
    if (!this.checkIfTradingDay(localTime)) return false;
    const hour = localTime.hour;
    const minute = localTime.minute;
    return (hour > this.openTime.hour && hour < this.closeTime.hour)
    || (hour === this.openTime.hour && minute >= this.openTime.minute)
    || (hour === this.closeTime.hour && minute < this.closeTime.minute);
  }
}

export function exchange(name: string): Exchange {
  return new Exchange(name);
}
export const supportedExchanges = Object.keys(exchanges);
