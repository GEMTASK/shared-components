import { Context, KopiValue, ReactElement } from '../types';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';

import type { KopiIterable } from './KopiIterable';

interface KopiStream<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  take(count: KopiNumber): KopiStream<TResult>;
}

const makeStream = <TResult extends KopiValue>(
  _fromIterable: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>
) => {
  interface KopiStream extends KopiValue, KopiIterable<TResult> { };

  let RangeIterable: {
    new(Stream: {
      new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiStream>;
    }): KopiIterable<KopiStream>;
  };

  import('./KopiIterable').then((result) => {
    RangeIterable = result.default(KopiStream);

    KopiStream.prototype.map = RangeIterable.prototype.map;
    KopiStream.prototype.filter = RangeIterable.prototype.filter;
    KopiStream.prototype.take = RangeIterable.prototype.take;
  });

  class KopiStream extends KopiValue implements AsyncIterable<KopiValue> {
    readonly iterable: AsyncIterable<KopiValue>;
    readonly fromIterable: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>;

    constructor(
      iterable: AsyncIterable<KopiValue>,
      fromIterable: ((iterable: AsyncIterable<KopiValue>) => Promise<TResult>) = _fromIterable
    ) {
      super();

      this.iterable = iterable;
      this.fromIterable = fromIterable;
    }

    override async inspect(): Promise<string | ReactElement> {
      const stream = (this.take(new KopiNumber(100)) as any).iterable;

      return (await _fromIterable(stream)).inspect();
    }

    [Symbol.asyncIterator]() {
      return this.iterable[Symbol.asyncIterator]();
    }
  }

  return KopiStream;
};

export default makeStream;

export {
  type KopiStream,
};
