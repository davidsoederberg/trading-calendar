import { DateTime } from 'luxon';
import exchanges from './exchanges.json';

class Exchange {
  private name: string;
  private timezone: string;
  private openTime;
  private closeTime;
  private exchange: {
    calendar: any;
    timezone: string;
    openTime: {
      hour: number;
      minute: number;
    };
    closeTime: {
      hour: number;
      minute: number;
    };
  };

  constructor(name: string) {
    this.name = name;
    this.exchange = exchanges[name as keyof typeof exchanges];
    this.timezone = this.exchange.timezone;
    this.openTime = this.exchange.openTime;
    this.closeTime = this.exchange.closeTime;
  }
  getName() {
    return this.name;
  }
  getTimezone() {
    return this.timezone;
  }
  isOpenToday(): boolean {
    const localTime = DateTime.local().setZone(this.timezone);
    if (localTime.weekday > 5) return false;
    const months = this.exchange.calendar[localTime.year.toString()].closed;
    if (months.hasOwnProperty(localTime.monthLong)) {
      return !months[localTime.monthLong].includes(localTime.day);
    }
    return true;
  }
  isTradingNow(): boolean {
    if (!this.isOpenToday) return false;
    const localTime = DateTime.local().setZone(this.timezone);
    const hour = localTime.hour;
    const minute = localTime.minute;
    return (
      hour >= this.openTime.hour &&
      minute >= this.openTime.minute &&
      hour <= this.closeTime.hour &&
      minute < this.closeTime.minute
    );
  }
}

export function exchange(name: string): Exchange {
  return new Exchange(name);
}
