import { KopiClass, KopiValue } from "../types.js";

class KopiDate extends KopiClass {
  readonly _date: Date;

  readonly day: number;
  readonly month: number;
  readonly year: number;

  static now() {
    return new KopiDate(new Date());
  }

  constructor(date: Date) {
    super();

    this._date = date;

    this.day = date.getDay();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  async inspect() {
    return this._date.toLocaleString();
  }
}

Object.defineProperty(KopiDate, 'name', {
  value: 'Date'
});

export default KopiDate;
