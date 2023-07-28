import { KopiValue } from '../types';

import KopiArray from './KopiArray';
import KopiNumber from './KopiNumber';
import KopiStream, { Iterable } from './KopiStream';

class KopiRange extends KopiValue implements Iterable<KopiRange> {
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

  take = KopiStream.prototype.take;
  map = KopiStream.prototype.map;
  filter = KopiStream.prototype.filter;
}

export default KopiRange;
