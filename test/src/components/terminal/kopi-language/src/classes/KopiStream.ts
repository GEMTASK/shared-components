import { Context, KopiValue, ReactElement } from '../types';

import KopiFunction from './KopiFunction';
import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';

import type { KopiIterable } from './KopiIterable';

interface KopiStream<TResult extends KopiValue> extends KopiValue, AsyncIterable<KopiValue> {
  [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  toArray(): Promise<KopiArray>;
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  flatMap(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: KopiNumber): KopiStream<TResult>;
  skip(count: KopiNumber): KopiStream<TResult>;
  repeat(): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
  splitOn(delimeter: KopiValue, context: Context): KopiStream<TResult>;
  splitAt(index: KopiValue, context: Context): KopiStream<TResult>;
  splitEvery(count: KopiNumber, context: Context): KopiStream<TResult>;
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
    RangeIterable = result.KopiIterable_T(KopiStream, _fromIterable);

    KopiStream.prototype.toArray = RangeIterable.prototype.toArray;
    KopiStream.prototype.map = RangeIterable.prototype.map;
    KopiStream.prototype.flatMap = RangeIterable.prototype.flatMap;
    KopiStream.prototype.filter = RangeIterable.prototype.filter;
    KopiStream.prototype.reduce = RangeIterable.prototype.reduce;
    KopiStream.prototype.take = RangeIterable.prototype.take;
    KopiStream.prototype.skip = RangeIterable.prototype.skip;
    KopiStream.prototype.repeat = RangeIterable.prototype.repeat;
    KopiStream.prototype.join = RangeIterable.prototype.join;
    KopiStream.prototype.splitOn = RangeIterable.prototype.splitOn;
    KopiStream.prototype.splitAt = RangeIterable.prototype.splitAt;
    KopiStream.prototype.splitEvery = RangeIterable.prototype.splitEvery;
    // TODO: combos requires creating two iterators from one, so has issues consuming data
    // KopiStream.prototype.combos = RangeIterable.prototype.combos;
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
  KopiStream_T,
};
