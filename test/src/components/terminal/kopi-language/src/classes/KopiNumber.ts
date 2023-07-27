import { KopiValue } from '../types';

import KopiString from './KopiString';

class KopiNumber extends KopiValue {
  static readonly PI: KopiNumber = new KopiNumber(Math.PI);
  static readonly E: KopiNumber = new KopiNumber(Math.E);

  readonly value: number;

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  toFixed(digits: KopiNumber) {
    return new KopiString(this.value.toFixed(digits.value));
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
