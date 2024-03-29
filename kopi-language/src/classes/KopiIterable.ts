import { Context, KopiClass, KopiValue } from '../types.js';

import KopiFunction from './KopiFunction.js';
import KopiTuple from './KopiTuple.js';
import KopiArray from './KopiArray.js';

import type { KopiStream } from './KopiStream.js';
import KopiBoolean from './KopiBoolean.js';

import { getSymbol } from '../utils.js';

const combineSymbol = getSymbol('combine');
const equalsSymbol = getSymbol('==');

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

import('./KopiStream.js').then((result) => {
  ArrayStream = result.KopiStream_T(KopiArray.fromIterable);
});

interface IKopiIterable<TResult extends KopiClass> {
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

  combos(): Promise<KopiValue>;
  some(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  every(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  find(func: KopiFunction, context: Context): Promise<KopiValue | KopiTuple>;
  includes(value: KopiValue, context: Context): Promise<KopiBoolean>;
}

function KopiIterable_T<TIterable extends KopiClass & AsyncIterable<TResult>, TResult extends KopiClass>(
  Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiStream<TResult>;
  },
  fromIterable: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>
) {
  class KopiIterable implements IKopiIterable<TResult> {
    async toArray(this: TIterable) {
      return KopiArray.fromIterable(this);
    }

    map(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          yield func.apply(KopiTuple.empty, [value, context]);
        }
      }.apply(this);

      return new Stream(generator);
    }

    flatMap(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          const mappedValue = await func.apply(KopiTuple.empty, [value, context]);

          if (typeof mappedValue === 'object' && Symbol.asyncIterator in mappedValue) {
            yield* (mappedValue as TIterable);
          } else {
            yield mappedValue;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    filter(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if ((await func.apply(KopiTuple.empty, [value, context]) as KopiBoolean).value) {
            yield value;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    async reduce(this: TIterable, func: KopiFunction, context: Context) {
      let accum: KopiValue = KopiTuple.empty;

      for await (const value of this) {
        if (accum === KopiTuple.empty && !(func.parameterPattern as any).fieldPatterns[0].defaultExpression) {
          accum = value;
        } else {
          accum = await func.apply(KopiTuple.empty, [new KopiTuple([accum, value]), context]);
        }
      }

      return accum;
    }

    take(this: TIterable, count: number) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (++index <= count) {
            yield value;
          } else {
            break;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    skip(this: TIterable, count: number) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (!(++index <= count)) {
            yield value;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    repeat(this: TIterable) {
      const values: KopiValue[] = [];

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          values.push(value);

          yield value;
        }

        for (let index = 0; ; ++index) {
          yield values[index % values.length];
        }
      }.apply(this);

      return new Stream(generator);
    }

    join(this: TIterable, joiner: KopiValue, context: Context) {
      return joiner.invoke(joiner, combineSymbol, [this, context]);
    }

    async combos(this: TIterable) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const a of this) {
          for await (const b of KopiIterable.prototype.skip.apply(this, [++index])) {
            yield new KopiTuple([a, b]);
          }
        }
      }.apply(this);

      return new ArrayStream(generator);

      // let array = await Promise.all(
      //   (await KopiArray.fromIterable(this))._elements
      // );

      // return new KopiArray(
      //   array.reduce(([combinations, subarray], a) => [
      //     [...combinations, ...subarray.slice(1).map(b => new KopiTuple([a, b]))],
      //     subarray.slice(1)
      //   ], [
      //     [] as KopiTuple[],
      //     array
      //   ])[0]
      // );
    }

    async some(this: TIterable, func: KopiFunction, context: Context): Promise<KopiBoolean> {
      for await (const value of this) {
        if ((await func.apply(KopiTuple.empty, [value, context]) as KopiBoolean).value) {
          return new KopiBoolean(true);
        }
      }

      return new KopiBoolean(false);
    }

    async every(this: TIterable, func: KopiFunction, context: Context): Promise<KopiBoolean> {
      for await (const value of this) {
        if (!(await func.apply(KopiTuple.empty, [value, context]) as KopiBoolean).value) {
          return new KopiBoolean(false);
        }
      }

      return new KopiBoolean(true);
    }

    async find(this: TIterable, func: KopiFunction, context: Context) {
      for await (const value of this) {
        if ((await func.apply(KopiTuple.empty, [value, context]) as KopiBoolean).value) {
          return value;
        }
      }

      return KopiTuple.empty;
    }

    async count(this: TIterable, func: KopiFunction, context: Context) {
      let count = 0;

      for await (const value of this) {
        if ((await func.apply(KopiTuple.empty, [value, context]) as KopiBoolean).value) {
          count += 1;
        }
      }

      return count;
    }

    async includes(this: TIterable, _value: KopiValue, context: Context) {
      for await (const value of this) {
        if ((await value.invoke(value, equalsSymbol, [_value, context]) as KopiBoolean).value) {
          return KopiBoolean.true;
        }
      }

      return KopiBoolean.false;
    }

    splitOn(this: TIterable, delimeter: KopiValue, context: Context) {
      let values: KopiValue[] = [];

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if ((await value.invoke(value, equalsSymbol, [delimeter, context]) as KopiBoolean).value) {
            yield fromIterable(new KopiArray(values));

            values = [];
          } else {
            values.push(value);
          }
        }

        yield fromIterable(new KopiArray(values));
      }.apply(this);

      return new ArrayStream(generator);
    }

    splitAt(this: TIterable, _index: number, context: Context) {
      let values: KopiValue[] = [];
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (index === _index) {
            yield fromIterable(new KopiArray(values));

            values = [value];
            ++index;
          } else {
            values.push(value);
            ++index;
          }
        }

        yield fromIterable(new KopiArray(values));
      }.apply(this);

      return new ArrayStream(generator);
    }

    splitEvery(this: TIterable, count: number, context: Context) {
      let values: KopiValue[] = [];
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (index !== 0 && index % count === 0) {
            yield fromIterable(new KopiArray(values));

            values = [value];
            index = 1;
          } else {
            values.push(value);
            ++index;
          }
        }

        yield fromIterable(new KopiArray(values));
      }.apply(this);

      return new ArrayStream(generator);
    }
  }

  return KopiIterable;
}

export default KopiIterable_T;

export {
  type IKopiIterable as KopiIterable,
  KopiIterable_T,
};
