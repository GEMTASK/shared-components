import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import KopiArray from './KopiArray';

import type { KopiStream } from './KopiStream';
import KopiBoolean from './KopiBoolean';

interface IKopiIterable<TResult extends KopiValue> {
  toArray(): Promise<KopiArray>;
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  flatMap(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: KopiNumber): KopiStream<TResult>;
  skip(count: KopiNumber): KopiStream<TResult>;
  repeat(): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
  combos(): Promise<KopiValue>;
  some(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  every(func: KopiFunction, context: Context): Promise<KopiBoolean>;
  find(func: KopiFunction, context: Context): Promise<KopiValue | KopiTuple>;
}

function KopiIterable_T<TIterable extends KopiValue & AsyncIterable<TResult>, TResult extends KopiValue>(
  Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiStream<TResult>;
  }
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

          if (Symbol.asyncIterator in mappedValue) {
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
          if ((await func.apply(KopiTuple.empty, [value, context]) as KopiNumber).value) {
            yield value;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    async reduce(this: TIterable, func: KopiFunction, context: Context) {
      let accum: KopiValue = KopiTuple.empty;

      for await (const value of this) {
        if (accum === KopiTuple.empty && !(func.parameterPattern as any).patterns[0].defaultExpression) {
          accum = value;
        } else {
          accum = await func.apply(KopiTuple.empty, [new KopiTuple([accum, value]), context]);
        }
      }

      return accum;
    }

    take(this: TIterable, count: KopiNumber) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (++index <= count.value) {
            yield value;
          } else {
            break;
          }
        }
      }.apply(this);

      return new Stream(generator);
    }

    skip(this: TIterable, count: KopiNumber) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if (!(++index <= count.value)) {
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
      return joiner.invoke('combine', [this, context]);
    }

    async combos(this: TIterable) {
      let index = 0;

      const generator = async function* (this: TIterable) {
        for await (const a of this) {
          for await (const b of KopiIterable.prototype.skip.apply(this, [new KopiNumber(++index)])) {
            yield new KopiTuple([a, b]);
          }
        }
      }.apply(this);

      return new Stream(generator);

      // let array = await Promise.all(
      //   (await KopiArray.fromIterable(this)).elements
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
  }

  return KopiIterable;
}

export default KopiIterable_T;

export {
  type IKopiIterable as KopiIterable,
};
