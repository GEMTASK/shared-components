import { Context, KopiValue } from '../types.js';

import { error } from '../utils.js';

import KopiString from './KopiString.js';
import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';
import KopiFunction from './KopiFunction.js';

function kopiOperator(argumentType: () => Function) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = async function (that: KopiValue) {
      if (!(that instanceof argumentType())) {
        throw error('number-operator-argument-type', {
          operator: propertyKey,
          value: await that.inspect(),
          type: await that.constructor.inspect()
        });
      }

      return original.call(this, that);
    };
  };
}

class KopiNumber extends KopiValue {
  static readonly PI: KopiNumber = new KopiNumber(Math.PI);
  static readonly E: KopiNumber = new KopiNumber(Math.E);

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

  @kopiOperator(() => KopiNumber)
  '=='(that: KopiNumber) {
    return new KopiBoolean(this.value === that.value);
  }

  '>'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this.value > that.value);
  }

  '<'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this.value < that.value);
  }

  '>='(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this.value >= that.value);
  }

  '<='(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this.value <= that.value);
  }

  //

  succ(count: KopiValue) {
    if (count === KopiTuple.empty) {
      count = new KopiNumber(1);
    }

    if (count instanceof KopiNumber) {
      return new KopiNumber(this.value + count.value);
    }

    throw error('number-method-argument-type', { method: 'succ' });
  }

  toFixed(digits: KopiValue) {
    if (digits === KopiTuple.empty) {
      return new KopiString(this.value.toFixed());
    }

    if (digits instanceof KopiNumber) {
      return new KopiString(this.value.toFixed(digits.value));
    }

    throw error('number-method-argument-type', { method: 'toFixed' });
  }

  even() {
    return this.value % 2 === 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  odd() {
    return this.value % 2 !== 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  //

  '^'(exponent: KopiValue) {
    if (!(exponent instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

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

  '$-'() {
    return new KopiNumber(-this.value);
  }

  async '+'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', {
        operator: '+',
        value: await that.inspect(),
        type: await that.constructor.inspect()
      });
    }

    return new KopiNumber(this.value + that.value);
  }

  '-'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiNumber(this.value - that.value);
  }

  '*'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiNumber(this.value * that.value);
  }

  '/'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiNumber(this.value / that.value);
  }

  '%'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw error('number-operator-argument-type', { operator: '+' });
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

Object.defineProperty(KopiNumber, 'name', {
  value: 'Number'
});

export default KopiNumber;
