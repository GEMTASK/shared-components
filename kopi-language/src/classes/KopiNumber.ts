import { Context, KopiClass, KopiValue } from '../types.js';

import { error } from '../utils.js';

import KopiString from './KopiString.js';
import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';
import KopiFunction from './KopiFunction.js';

function kopiOperator(argumentType: () => Function) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
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

class KopiNumber extends KopiClass {
  static readonly Zero = new KopiNumber(0);
  static readonly PI: number = Math.PI;
  static readonly E: number = Math.E;

  static async apply(thisArg: void, [value, context]: [KopiValue, Context]) {
    if (typeof value === 'number') {
      return value;
    }

    return Number((await value.toString()).value);
  }

  //

  readonly value: number;

  //

  constructor(value: number) {
    super();

    this.value = value;
  }

  async toString(this: number) {
    return new KopiString(`${this}`);
  }

  override async inspect() {
    return `${this.value}`;
  }

  apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    return func.apply(KopiTuple.empty, [this, context]);
  }

  //

  // @kopiOperator(() => Number)
  '=='(this: number, that: number) {
    return new KopiBoolean(this === that);
  }

  // @kopiOperator(() => KopiNumber)
  '!='(this: number, that: number) {
    return new KopiBoolean(this !== that);
  }

  '>'(this: number, that: number) {
    if (!(typeof that !== 'number')) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this > that);
  }

  '<'(this: number, that: number) {
    if (!(typeof that !== 'number')) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this < that);
  }

  '>='(this: number, that: number) {
    if (!(typeof that !== 'number')) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this >= that);
  }

  '<='(this: number, that: number) {
    if (!(typeof that !== 'number')) {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return new KopiBoolean(this <= that);
  }

  //

  succ(this: number, count: KopiValue) {
    if (count === KopiTuple.empty) {
      count = 1;
    }

    if (typeof count === 'number') {
      return this + count;
    }

    throw error('number-method-argument-type', { method: 'succ' });
  }

  toFixed(this: number, digits: KopiValue) {
    if (digits === KopiTuple.empty) {
      return new KopiString(this.toFixed());
    }

    if (typeof digits === 'number') {
      return new KopiString(this.toFixed(digits));
    }

    throw error('number-method-argument-type', { method: 'toFixed' });
  }

  even(this: number) {
    return this % 2 === 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  odd(this: number) {
    return this % 2 !== 0 ? KopiBoolean.true : KopiBoolean.false;
  }

  //

  '^'(this: number, exponent: KopiValue) {
    if (typeof exponent !== 'number') {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return this ** exponent;
  }

  sqrt(this: number) {
    return Math.sqrt(this);
  }

  abs(this: number) {
    return Math.abs(this);
  }

  floor(this: number) {
    return Math.floor(this);
  }

  round(this: number) {
    return Math.round(this);
  }

  ceil(this: number) {
    return Math.ceil(this);
  }

  //
  // Arithmetic
  //

  '$-'(this: number) {
    return -this;
  }

  async '+'(this: number, that: KopiValue) {
    if (typeof that !== 'number') {
      throw error('number-operator-argument-type', {
        operator: '+',
        value: await that.inspect(),
        type: await that.constructor.inspect()
      });
    }

    return this + that;
  }

  '-'(this: number, that: number) {
    if (typeof that !== 'number') {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return this - that;
  }

  '*'(this: number, that: number) {
    if (typeof that !== 'number') {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return this * that;
  }

  '/'(this: number, that: number) {
    if (typeof that !== 'number') {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return this / that;
  }

  '%'(this: number, that: number) {
    if (typeof that !== 'number') {
      throw error('number-operator-argument-type', { operator: '+' });
    }

    return this % that;
  }

  //
  // Trigonometry
  //

  sin(this: number) {
    return Math.sin(this);
  }

  cos(this: number) {
    return Math.cos(this);
  }
}

Object.defineProperty(KopiNumber, 'name', {
  value: 'Number'
});

Number.prototype.invoke = function (thisArg: number, methodName: string, [argument, context]: [KopiValue, Context]) {
  return KopiNumber.prototype.invoke.apply(KopiNumber.Zero, [thisArg, methodName, [argument, context]]);
};

export default KopiNumber;
