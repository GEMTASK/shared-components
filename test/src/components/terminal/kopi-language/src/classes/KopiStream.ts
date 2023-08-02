import { Context, KopiValue, ReactElement } from '../types';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';

import type { KopiIterable } from './KopiIterable';

interface KopiStream<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: KopiNumber): KopiStream<TResult>;
  repeat(): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
}

const KopiStream_T = <TResult extends KopiValue>(
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
    KopiStream.prototype.reduce = RangeIterable.prototype.reduce;
    KopiStream.prototype.take = RangeIterable.prototype.take;
    KopiStream.prototype.join = RangeIterable.prototype.join;
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

      return (await _fromIterable(stream)).inspect(); // TODO: use _fromIterable or fromIterable?
    }

    [Symbol.asyncIterator]() {
      return this.iterable[Symbol.asyncIterator]();
    }
  }

  return KopiStream;
};

export default KopiStream_T;

export {
  type KopiStream,
};
