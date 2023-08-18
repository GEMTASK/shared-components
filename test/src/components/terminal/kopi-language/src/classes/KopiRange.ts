import { KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';

import type { KopiStream } from './KopiStream';
import type { KopiIterable } from './KopiIterable';
import KopiBoolean from './KopiBoolean';

interface KopiRange extends KopiValue, KopiIterable<KopiArray> { };

let RangeStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let RangeIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream').then((result) => {
  RangeStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable').then((result) => {
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
//
//

class KopiRange extends KopiValue implements AsyncIterable<KopiValue> {
  // static emptyValue = () => new KopiArray([]);

  from: KopiValue | Promise<KopiValue>;
  to: KopiValue | Promise<KopiValue>;
  stride: KopiNumber;

  constructor(
    from: KopiValue | Promise<KopiValue>,
    to: KopiValue | Promise<KopiValue>,
    stride?: KopiNumber
  ) {
    super();

    this.from = from;
    this.to = to;
    this.stride = stride ?? new KopiNumber(1);

    Promise.all([from, to]).then(([from, to]) => {
      this.from = from;
      this.to = to;
    });
  }

  override async inspect() {
    return `${await (await this.from).inspect()}..${await (await this.to).inspect()}`;
  }

  async *[Symbol.asyncIterator]() {
    const [from, to] = await Promise.all([this.from, this.to]);

    if (from instanceof KopiNumber && to instanceof KopiNumber) {
      for (let current = from.value; current <= to.value; current += this.stride.value) {
        yield new KopiNumber(current);
      }
    }

    let context = null as any;
    for (
      let current = from;
      (await current.invoke('<=', [to, context]) as KopiBoolean).value;
      current = await current.invoke('succ', [this.stride, context])
    ) {
      yield current;
    }
  }

  //

  apply(thisArg: this, [stride]: [stride: KopiNumber]) {
    return new KopiRange(this.from, this.to, stride);
  }
}

export default KopiRange;
