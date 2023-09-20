import { KopiValue } from "../types.js";

import KopiNumber from "./KopiNumber.js";

class KopiDate extends KopiValue {
  readonly _date: Date;

  readonly day: KopiNumber;
  readonly month: KopiNumber;
  readonly year: KopiNumber;

  static now() {
    return new KopiDate(new Date());
  }

  constructor(date: Date) {
    super();

    this._date = date;

    this.day = new KopiNumber(date.getDay());
    this.month = new KopiNumber(date.getMonth());
    this.year = new KopiNumber(date.getFullYear());
  }

  async inspect() {
    return this._date.toLocaleString();
  }
}

Object.defineProperty(KopiDate, 'name', {
  value: 'Date'
});

export default KopiDate;
