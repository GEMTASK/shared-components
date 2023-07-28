import { KopiValue, ReactElement } from '../types';
import KopiArray from './KopiArray';

import KopiIterable from './KopiIterable';

async function from(iterable: AsyncIterable<KopiValue>) {
  let elements: KopiValue[] = [];

  for await (const element of iterable) {
    elements = [...elements, await element];
  }

  return new KopiArray(elements);
}

const KopiStream2 = <TFromResult extends KopiValue>(
  _from?: (iterable: AsyncIterable<KopiValue>) => Promise<TFromResult>
) => {
  const Iterable = KopiIterable(from);

  class KopiStream extends KopiValue implements AsyncIterable<KopiValue> {
    readonly iterable: AsyncIterable<KopiValue>;
    readonly from?: (iterable: AsyncIterable<KopiValue>) => Promise<TFromResult>;

    map = Iterable.prototype.map;

    constructor(
      iterable: AsyncIterable<KopiValue>,
      from: ((iterable: AsyncIterable<KopiValue>) => Promise<TFromResult>) | undefined = _from
    ) {
      super();

      this.iterable = iterable;
      this.from = from;
    }

    override async inspect(): Promise<string | ReactElement> {
      if (from) {
        return (await from(this)).inspect();
      }

      const array = [];
      let index = 0;

      for await (const value of this) {
        if (++index > 100) break;

        array.push(value);
      }

      const elements = await Promise.all(
        array.map(async element => (await element).inspect())
      );

      return `[${elements.join(', ')}${index > 100 ? ', ...' : ''}]`;
    }

    [Symbol.asyncIterator]() {
      return this.iterable[Symbol.asyncIterator]();
    }
  }

  return KopiStream;
};

class KopiStream<T extends KopiValue> extends KopiValue implements AsyncIterable<KopiValue> {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  Iterable = KopiIterable(this.from);

  map = this.Iterable.prototype.map;
  filter = this.Iterable.prototype.filter;
  take = this.Iterable.prototype.take;

  constructor(iterable: AsyncIterable<KopiValue>, from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;
  }

  override async inspect(): Promise<string | ReactElement> {
    if (this.from) {
      return (await this.from(this)).inspect();
    }

    const array = [];
    let index = 0;

    for await (const value of this) {
      if (++index > 100) break;

      array.push(value);
    }

    const elements = await Promise.all(
      array.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}${index > 100 ? ', ...' : ''}]`;
  }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }
}

export default KopiStream;

export {
  KopiStream2,
};
