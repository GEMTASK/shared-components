import { KopiValue } from './types';

class KopiNumber extends KopiValue {
  readonly value: number;

  constructor(value: number) {
    super();

    this.value = value;
  }

  '+'(that: KopiValue) {
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value + that.value);
    }

    throw new Error();
  }

  '-'(that: KopiValue) {
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value - that.value);
    }

    throw new Error();
  }
}

export {
  KopiNumber,
};
