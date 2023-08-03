import { KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';

import type { KopiStream } from './KopiStream';
import type { KopiIterable } from './KopiIterable';

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
  RangeStream = result.default(KopiArray.fromIterable);

  import('./KopiIterable').then((result) => {
    RangeIterable = result.default(RangeStream);

    KopiRange.prototype.toArray = RangeIterable.prototype.toArray;
    KopiRange.prototype.map = RangeIterable.prototype.map;
    KopiRange.prototype.flatMap = RangeIterable.prototype.flatMap;
    KopiRange.prototype.filter = RangeIterable.prototype.filter;
    KopiRange.prototype.reduce = RangeIterable.prototype.reduce;
    KopiRange.prototype.take = RangeIterable.prototype.take;
    KopiRange.prototype.skip = RangeIterable.prototype.skip;
    KopiRange.prototype.repeat = RangeIterable.prototype.repeat;
    KopiRange.prototype.join = RangeIterable.prototype.join;
    KopiRange.prototype.combinations = RangeIterable.prototype.combinations;
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

      return;
    }

    throw new Error(`Only range over numbers is supported currently.`);
  }

  apply(thisArg: this, [stride]: [stride: KopiNumber]) {
    return new KopiRange(this.from, this.to, stride);
  }
}

export default KopiRange;
