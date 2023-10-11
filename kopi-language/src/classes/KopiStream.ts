import { Context, KopiClass, KopiValue, ReactElement } from '../types.js';

import KopiFunction from './KopiFunction.js';
import KopiArray from './KopiArray.js';

import type { KopiIterable } from './KopiIterable.js';

interface KopiStream<TResult extends KopiClass> extends KopiClass, AsyncIterable<KopiValue> {
  [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  toArray(): Promise<KopiArray>;
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  flatMap(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: number): KopiStream<TResult>;
  skip(count: number): KopiStream<TResult>;
  repeat(): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
  count(func: KopiFunction, context: Context): Promise<number>;
  splitOn(delimeter: KopiValue, context: Context): KopiStream<TResult>;
  splitAt(index: KopiValue, context: Context): KopiStream<TResult>;
  splitEvery(count: number, context: Context): KopiStream<TResult>;
}

const KopiStream_T = <TResult extends KopiClass>(
  _fromIterable: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>
) => {
  interface KopiStream extends KopiClass, KopiIterable<TResult> { };

  let RangeIterable: {
    new(Stream: {
      new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiStream>;
    }): KopiIterable<KopiStream>;
  };

  import('./KopiIterable.js').then((result) => {
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
    KopiStream.prototype.count = RangeIterable.prototype.count;
    KopiStream.prototype.splitOn = RangeIterable.prototype.splitOn;
    KopiStream.prototype.splitAt = RangeIterable.prototype.splitAt;
    KopiStream.prototype.splitEvery = RangeIterable.prototype.splitEvery;
    // TODO: combos requires creating two iterators from one, so has issues consuming data
    // KopiStream.prototype.combos = RangeIterable.prototype.combos;
  });

  class KopiStream extends KopiClass implements AsyncIterable<KopiValue> {
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
      const stream = (this.take(100) as any).iterable;

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
