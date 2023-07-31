import { KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import makeIterable, { KopiIterable } from './KopiIterable';
import KopiArray from './KopiArray';
import makeStream from './KopiStream';

interface KopiRange extends KopiValue, KopiIterable<KopiArray> { };

class KopiRange extends KopiValue implements AsyncIterable<KopiValue> {
  // static emptyValue = () => new KopiArray([]);

  static RangeStream = makeStream(KopiArray.fromIterable);
  static RangeIterable = makeIterable(KopiRange.RangeStream);

  static {
    KopiRange.prototype.map = KopiRange.RangeIterable.prototype.map;
    KopiRange.prototype.filter = KopiRange.RangeIterable.prototype.filter;
    KopiRange.prototype.take = KopiRange.RangeIterable.prototype.take;
  }

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
}

export default KopiRange;
