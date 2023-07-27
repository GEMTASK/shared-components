import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';

// TODO: Should all methods be async?

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

  constructor(value: string) {
    super();

    this.value = value;
  }

  override async toString() {
    return this.value;
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
      values += await element.toString();
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

  split(delimeter: KopiString | KopiTuple) {
    if (delimeter instanceof KopiTuple) {
      return new KopiArray(
        this.value.split('').map(string => Promise.resolve(new KopiString(string)))
      );
    }

    return new KopiArray(
      this.value.split(delimeter.value).map(string => Promise.resolve(new KopiString(string)))
    );
  }

  reduce(value: KopiValue) {
    return async (func: KopiFunction, context: Context) => {
      let accum: Promise<KopiValue> = Promise.resolve(value);

      for await (const value of this) {
        accum = func.apply(KopiTuple.empty, [new KopiTuple([accum, Promise.resolve(value)]), context]);
      }

      return accum;
    };
  }
}

export default KopiString;
