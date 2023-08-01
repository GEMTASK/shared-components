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

    KopiRange.prototype.map = RangeIterable.prototype.map;
    KopiRange.prototype.filter = RangeIterable.prototype.filter;
    KopiRange.prototype.reduce = RangeIterable.prototype.reduce;
    KopiRange.prototype.take = RangeIterable.prototype.take;
    // KopiRange.prototype.repeat = RangeIterable.prototype.repeat;
    KopiRange.prototype.join = RangeIterable.prototype.join;

    console.log('...', KopiRange.prototype.reduce);
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
    if (this.from instanceof KopiNumber && this.to instanceof KopiNumber) {
      for (let current = this.from.value; current <= this.to.value; ++current) {
        yield new KopiNumber(current);
      }

      return;
    }

    throw new Error(`Only range over numbers is supported currently.`);
  }

  async repeat() {
    const values: KopiValue[] = [];

    const generator = async function* (this: KopiRange) {
      for await (const value of this) {
        values.push(value);

        yield value;
      }

      for (let index = 0; ; ++index) {
        yield values[index % values.length];
      }
    }.apply(this);

    return new RangeStream(generator);
  }
}

export default KopiRange;
