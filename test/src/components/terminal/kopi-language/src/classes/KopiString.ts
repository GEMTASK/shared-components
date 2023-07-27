import { Context, KopiValue } from '../types';

import { KopiNumber } from '../classes';
import { KopiFunction } from '../classes';
import { KopiTuple } from '../classes';

class KopiStream<T extends KopiValue> extends KopiValue {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  constructor(iterable: AsyncIterable<KopiValue>, from: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;
  }

  override async inspect() {
    return (await this.from(this.iterable)).inspect();
  }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  map(func: KopiFunction, context: Context): KopiStream<T> {
    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator, this.from);
  }
}

//
//
//

class KopiString extends KopiValue {
  readonly value: string;

  constructor(value: string, withIterator = true) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.value) {
      yield new KopiString(value);
    }
  }

  static async from(iterable: AsyncIterable<KopiValue>) {
    let values: string = '';

    for await (const element of iterable) {
      values += (element as KopiString).value;
    }

    return new KopiString(values);
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  toUpperCase() {
    return new KopiString(this.value.toLocaleUpperCase());
  }

  trim() {
    return new KopiString(this.value.trim());
  }

  map(func: KopiFunction, context: Context): KopiStream<KopiString> {
    const generator = async function* (this: KopiString) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator, KopiString.from);
  }

  // split() {
  //   return new KopiString(this.value.split(''))
  // }

  // "abc" | reduce 1 (acc, n) => acc * n
  reduce(value: KopiValue) {
    return (func: KopiValue) => {
      console.log(value, func);
      return new KopiString(`String.reduce with curried parameters.`);
    };
  }
}

export default KopiString;
