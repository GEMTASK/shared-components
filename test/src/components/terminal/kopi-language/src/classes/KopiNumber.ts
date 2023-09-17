import { Context, KopiValue } from '../types';

import KopiString from './KopiString';
import KopiBoolean from './KopiBoolean';
import KopiTuple from './KopiTuple';
import KopiFunction from './KopiFunction';

class KopiNumber extends KopiValue {
  static readonly PI: KopiNumber = new KopiNumber(Math.PI);
  static readonly E: KopiNumber = new KopiNumber(Math.E);

  static async inspect() {
    return 'Number';
  }

  static async apply(thisArg: void, [value, context]: [KopiValue, Context]) {
    return new KopiNumber(Number((await value.toString()).value));
  }

  //

  readonly value: number;

  //

  constructor(value: number) {
    super();

    this.value = value;
  }

  async toString() {
    return new KopiString(`${this.value}`);
  }

  override async inspect() {
    return `${this.value}`;
  }

  apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    return func.apply(KopiTuple.empty, [this, context]);
  }

  //

  '=='(that: KopiNumber) {
    return new KopiBoolean(this.value === that.value);
  }

  '>'(that: KopiNumber) {
    return new KopiBoolean(this.value > that.value);
  }

  '<'(that: KopiNumber) {
    return new KopiBoolean(this.value < that.value);
  }

  '>='(that: KopiNumber) {
    return new KopiBoolean(this.value >= that.value);
  }

  '<='(that: KopiNumber) {
    return new KopiBoolean(this.value <= that.value);
  }

  //

  succ(count: KopiNumber | KopiTuple) {
    if (count === KopiTuple.empty) {
      count = new KopiNumber(1);
    }

    if (count instanceof KopiNumber) {
      return new KopiNumber(this.value + count.value);
    }
  }

  toFixed(digits: KopiNumber | KopiTuple) {
    if (digits === KopiTuple.empty) {
      return new KopiString(this.value.toFixed());
    }

    if (digits instanceof KopiNumber) {
      return new KopiString(this.value.toFixed(digits.value));
    }
  }

  even() {
    return this.value % 2 === 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  odd() {
    return this.value % 2 !== 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  //

  '^'(exponent: KopiNumber) {
    return new KopiNumber(this.value ** exponent.value);
  }

  sqrt() {
    return new KopiNumber(Math.sqrt(this.value));
  }

  abs() {
    return new KopiNumber(Math.abs(this.value));
  }

  floor() {
    return new KopiNumber(Math.floor(this.value));
  }

  round() {
    return new KopiNumber(Math.round(this.value));
  }

  ceil() {
    return new KopiNumber(Math.ceil(this.value));
  }

  //
  // Arithmetic
  //

  '$-'(that: KopiValue) {
    return new KopiNumber(-this.value);
  }

  '+'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value + that.value);
  }

  '-'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value - that.value);
  }

  '*'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value * that.value);
  }

  '/'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value / that.value);
  }

  '%'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value % that.value);
  }

  //
  // Trigonometry
  //

  sin() {
    return new KopiNumber(Math.sin(this.value));
  }

  cos() {
    return new KopiNumber(Math.cos(this.value));
  }
}

export default KopiNumber;
