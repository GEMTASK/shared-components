import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';

import type { KopiStream } from './KopiStream';

// TODO: Avoid recursive imports KopiStream > KopiIterable > KopiStream

interface KopiIterable<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: KopiNumber): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
}

interface IKopiIterable<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  reduce(func: KopiFunction, context: Context): Promise<KopiValue>;
  take(count: KopiNumber): KopiStream<TResult>;
  join(joiner: KopiValue, context: Context): Promise<KopiValue>;
}

function makeIterable<TIterable extends KopiValue & AsyncIterable<TResult>, TResult extends KopiValue>(
  Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiStream<TResult>;
  }
) {
  class KopiIterable implements IKopiIterable<TResult> {
    map(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          yield func.apply(KopiTuple.empty, [value, context]);
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
        accum = await func.apply(KopiTuple.empty, [new KopiTuple([accum, value]), context]);
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

    join(this: TIterable, joiner: KopiValue, context: Context) {
      return joiner.invoke('combine', [this, context]);
    }
  }

  return KopiIterable;
}

export default makeIterable;

export {
  type KopiIterable,
};
