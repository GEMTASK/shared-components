import { Context, KopiClass, KopiValue } from '../types.js';

import KopiArray from './KopiArray.js';
import KopiFunction from './KopiFunction.js';
import KopiTuple from './KopiTuple.js';
import KopiBoolean from './KopiBoolean.js';
import KopiRange from './KopiRange.js';

import type { KopiStream } from './KopiStream.js';
import type { KopiIterable } from './KopiIterable.js';

interface KopiString extends KopiClass {
  toArray(): Promise<KopiArray>;
  map(func: KopiFunction, context: Context): KopiStream<KopiString>;
  filter(func: KopiFunction, context: Context): KopiStream<KopiString>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  combos(): Promise<KopiValue>;
  some(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  every(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  find(func: KopiFunction, context: Context): Promise<KopiValue | KopiTuple>;
  count(func: KopiFunction, context: Context): Promise<number>;
  includes(value: KopiValue, context: Context): Promise<KopiBoolean>;
  splitOn(delimeter: KopiValue, context: Context): KopiStream<KopiString>;
  splitAt(index: KopiValue, context: Context): KopiStream<KopiString>;
  splitEvery(count: number, context: Context): KopiStream<KopiString>;
};

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let values: string = '';

  for await (const element of iterable) {
    if (typeof element === 'number') {
      values += element.toString();
    } else {
      values += (await element.toString()).value;
    }
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

import('./KopiStream.js').then((result) => {
  StringStream = result.KopiStream_T(fromIterable);
  ArrayStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable.js').then((result) => {
    StringIterable = result.KopiIterable_T(StringStream, fromIterable);
    ArrayIterable = result.KopiIterable_T(ArrayStream, KopiArray.fromIterable);

    KopiString.prototype.toArray = ArrayIterable.prototype.toArray;
    KopiString.prototype.map = ArrayIterable.prototype.map;
    KopiString.prototype.filter = StringIterable.prototype.filter;
    KopiString.prototype.reduce = StringIterable.prototype.reduce;
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
// class KopiString
//

class KopiString extends KopiClass implements AsyncIterable<KopiValue> {
  static newline = new KopiString('\n');

  static async apply(thisArg: void, [value, context]: [KopiValue, Context]) {
    return new KopiString(String(value));
  }

  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    return fromIterable(iterable);
  }

  readonly value: string;
  readonly codePoints: string[];

  constructor(value: string) {
    super();

    this.value = value;
    this.codePoints = [...value];

    Object.defineProperty(this, 'size', {
      get: () => this.value.length
    });
  }

  override async toString() {
    return this;
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

  '!='(that: KopiString) {
    return new KopiBoolean(this.value !== that.value);
  }

  '<'(that: KopiString) {
    return new KopiBoolean(this.value < that.value);
  }

  '>'(that: KopiString) {
    return new KopiBoolean(this.value > that.value);
  }

  '<='(that: KopiString) {
    return new KopiBoolean(this.value <= that.value);
  }

  '>='(that: KopiString) {
    return new KopiBoolean(this.value >= that.value);
  }

  size() {
    return this.value.length;
  }

  async at(index: number | KopiRange) {
    if (index instanceof KopiRange) {
      const [from, to] = await Promise.all([
        index.from,
        index.to
      ]);

      if (typeof from === 'number' && typeof to === 'number') {
        return new KopiString(this.codePoints.slice(from, to).join(''));
      }

      throw new Error('String at range must be numeric.');
    }

    const string = this.codePoints[index];

    if (string) {
      return new KopiString(string);
    }

    return KopiTuple.empty;
  }

  '++'(that: KopiString) {
    return new KopiString(this.value + that.value);
  }

  toUpper() {
    return new KopiString(this.value.toLocaleUpperCase());
  }

  trim() {
    return new KopiString(this.value.trim());
  }

  async apply(thisArg: this, [that]: [that: KopiValue]) {
    if (typeof that === 'number') {
      new KopiString(this.value.concat(that.toString()));
    } else {
      return new KopiString(this.value.concat((await that.toString()).value));
    }
  }

  succ(count: number | KopiTuple): KopiString {
    if (count === KopiTuple.empty) {
      count = 1;
    }
    console.log('count', count);
    if (typeof count === 'number') {
      const codePoint = this.value.codePointAt(0);

      if (codePoint) {
        return new KopiString(String.fromCodePoint(codePoint + count));
      }
    }

    throw new Error('Error KopiString.succ()');
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

  // async combine(iterable: AsyncIterable<KopiValue>) {
  //   const generator = async function* (this: KopiString) {
  //     let index = 0;

  //     for await (const value of iterable) {
  //       if (index++ > 0) {
  //         yield this;
  //       }

  //       yield new KopiString(await value.toString());
  //     }
  //   }.apply(this);

  //   return new StringStream(generator);
  // }

  async combine(iterable: AsyncIterable<KopiValue>) {
    let array = [];

    for await (const value of iterable) {
      if (typeof value === 'number') {
        array.push(new KopiString(value.toString()));
      } else {
        array.push(await value.toString());
      }
    }

    return new KopiString(array.map(string => string.value).join(this.value));
  }

  join(joiner: KopiValue, context: Context) {
    return joiner.invoke(joiner, 'combine', [this, context]);
  }
}

Object.defineProperty(KopiString, 'name', {
  value: 'String'
});

export default KopiString;
