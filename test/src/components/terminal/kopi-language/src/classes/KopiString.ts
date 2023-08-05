import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import KopiBoolean from './KopiBoolean';

import type { KopiStream } from './KopiStream';
import type { KopiIterable } from './KopiIterable';

interface KopiString extends KopiValue {
  map(func: KopiFunction, context: Context): KopiStream<KopiString>;
  combos(): Promise<KopiValue>;
  some(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  every(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  find(func: KopiFunction, context: Context): Promise<KopiValue | KopiTuple>;
  count(func: KopiFunction, context: Context): Promise<KopiNumber>;
  includes(value: KopiValue, context: Context): Promise<KopiBoolean>;
  splitOn(delimeter: KopiValue, context: Context): KopiStream<KopiString>;
  splitAt(index: KopiValue, context: Context): KopiStream<KopiString>;
  splitEvery(count: KopiNumber, context: Context): KopiStream<KopiString>;
};

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let values: string = '';

  for await (const element of iterable) {
    values += await element.toString();
  }

  return new KopiString(values);
}

let StringStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiString>;
};

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let StringIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiString>;
  }): KopiIterable<KopiString>;
};

let ArrayIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream').then((result) => {
  StringStream = result.KopiStream_T(fromIterable);
  ArrayStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable').then((result) => {
    StringIterable = result.KopiIterable_T(StringStream, fromIterable);
    ArrayIterable = result.KopiIterable_T(ArrayStream, KopiArray.fromIterable);

    KopiString.prototype.map = ArrayIterable.prototype.map;
    KopiString.prototype.combos = StringIterable.prototype.combos;
    KopiString.prototype.some = StringIterable.prototype.some;
    KopiString.prototype.every = StringIterable.prototype.every;
    KopiString.prototype.find = StringIterable.prototype.find;
    KopiString.prototype.count = StringIterable.prototype.count;
    KopiString.prototype.includes = StringIterable.prototype.includes;
    KopiString.prototype.splitOn = StringIterable.prototype.splitOn;
    KopiString.prototype.splitAt = StringIterable.prototype.splitAt;
    KopiString.prototype.splitEvery = StringIterable.prototype.splitEvery;
  });
});

//
//
//

class KopiString extends KopiValue implements AsyncIterable<KopiValue> {
  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    return fromIterable(iterable);
  }

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

  '=='(that: KopiString) {
    return new KopiBoolean(this.value === that.value);
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  toUpper() {
    return new KopiString(this.value.toLocaleUpperCase());
  }

  trim() {
    return new KopiString(this.value.trim());
  }

  apply(thisArg: this, [that]: [that: this]) {
    return new KopiString(this.value.concat(that.value));
  }

  succ(count: KopiNumber | KopiTuple): KopiString {
    if (count === KopiTuple.empty) {
      count = new KopiNumber(1);
    }

    if (count instanceof KopiNumber) {
      const codePoint = this.value.codePointAt(0);

      if (codePoint) {
        return new KopiString(String.fromCodePoint(codePoint + count.value));
      }
    }

    throw new Error('KopiString.succ()');
  }

  empty() {
    return new KopiBoolean(this.value.length === 0);
  }

  //

  split(delimeter: KopiString | KopiTuple) {
    if (delimeter instanceof KopiTuple) {
      return new KopiArray(
        this.value.split('').map(string => new KopiString(string))
      );
    }

    return new KopiArray(
      this.value.split(delimeter.value).map(string => new KopiString(string))
    );
  }

  async combine(iterable: AsyncIterable<KopiValue>) {
    const generator = async function* (this: KopiString) {
      let index = 0;

      for await (const value of iterable) {
        if (index++ > 0) {
          yield this;
        }

        yield new KopiString(await value.toString());
      }
    }.apply(this);

    return new StringStream(generator);
  }

  async reduce(func: KopiFunction, context: Context) {
    let accum: KopiValue = KopiTuple.empty;

    for await (const value of this) {
      if (accum === KopiTuple.empty) {
        accum = value;
      } else {
        accum = await func.apply(KopiTuple.empty, [new KopiTuple([accum, value]), context]);
      }
    }

    return accum;
  }

  join(joiner: KopiValue, context: Context) {
    return joiner.invoke('combine', [this, context]);
  }
}

export default KopiString;
