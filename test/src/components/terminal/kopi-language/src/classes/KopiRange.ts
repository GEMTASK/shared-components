import { KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiIterable from './KopiIterable';
import KopiArray from './KopiArray';

const Iterable = KopiIterable();

class KopiRange extends KopiValue implements AsyncIterable<KopiValue> {
  // static emptyValue = () => new KopiArray([]);

  from: KopiValue | Promise<KopiValue>;
  to: KopiValue | Promise<KopiValue>;
  stride: KopiNumber;

  map = Iterable.prototype.map;
  filter = Iterable.prototype.filter;
  take = Iterable.prototype.take;

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
