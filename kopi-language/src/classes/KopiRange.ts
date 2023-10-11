import { KopiClass, KopiValue } from '../types.js';

import KopiArray from './KopiArray.js';
import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';
import KopiString from './KopiString.js';

import type { KopiStream } from './KopiStream.js';
import type { KopiIterable } from './KopiIterable.js';

interface KopiRange extends KopiClass, KopiIterable<KopiArray> { };

let RangeStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let RangeIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream.js').then((result) => {
  RangeStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable.js').then((result) => {
    RangeIterable = result.KopiIterable_T(RangeStream, KopiArray.fromIterable);

    KopiRange.prototype.toArray = RangeIterable.prototype.toArray;
    KopiRange.prototype.map = RangeIterable.prototype.map;
    KopiRange.prototype.flatMap = RangeIterable.prototype.flatMap;
    KopiRange.prototype.filter = RangeIterable.prototype.filter;
    KopiRange.prototype.reduce = RangeIterable.prototype.reduce;
    KopiRange.prototype.take = RangeIterable.prototype.take;
    KopiRange.prototype.skip = RangeIterable.prototype.skip;
    KopiRange.prototype.repeat = RangeIterable.prototype.repeat;
    KopiRange.prototype.join = RangeIterable.prototype.join;
    KopiRange.prototype.count = RangeIterable.prototype.count;
    KopiRange.prototype.splitOn = RangeIterable.prototype.splitOn;
    KopiRange.prototype.splitAt = RangeIterable.prototype.splitAt;
    KopiRange.prototype.splitEvery = RangeIterable.prototype.splitEvery;

    KopiRange.prototype.combos = RangeIterable.prototype.combos;
    KopiRange.prototype.some = RangeIterable.prototype.some;
    KopiRange.prototype.every = RangeIterable.prototype.every;
    KopiRange.prototype.find = RangeIterable.prototype.find;
    KopiRange.prototype.includes = RangeIterable.prototype.includes;
  });
});

//
// class KopiRange
//

class KopiRange extends KopiClass implements AsyncIterable<KopiValue> {
  // static emptyValue = () => new KopiArray([]);

  from: KopiValue | Promise<KopiValue>;
  to: KopiValue | Promise<KopiValue>;
  stride: number;

  constructor(
    from: KopiValue | Promise<KopiValue>,
    to: KopiValue | Promise<KopiValue>,
    stride?: number
  ) {
    super();

    this.from = from;
    this.to = to;
    this.stride = stride ?? 1;

    Promise.all([from, to]).then(([from, to]) => {
      this.from = from;
      this.to = to;
    });
  }

  async toString() {
    return new KopiString(await this.inspect());
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}${this.stride !== 1 ? ` (by: ${this.stride})` : ''}`;
  }

  async *[Symbol.asyncIterator]() {
    const [from, to] = await Promise.all([this.from, this.to]);

    if (typeof from === 'number' && typeof to === 'number') {
      for (let current = from; current <= to; current += this.stride) {
        yield current;
      }

      return;
    }

    const context = null as any;

    for (
      let current = from;
      (await current.invoke(current, '<=', [to, context]) as KopiBoolean).value;
      current = await current.invoke(current, 'succ', [this.stride, context])
    ) {
      yield current;
    }
  }

  //

  async apply(thisArg: this, [stride]: [stride: KopiTuple]) {
    return new KopiRange(this.from, this.to, await stride.fields[0] as number);
  }
}

export default KopiRange;
