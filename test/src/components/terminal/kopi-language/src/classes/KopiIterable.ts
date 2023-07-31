import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';

import type { KopiStream } from './KopiStream';

// TODO: Avoid recursive imports KopiStream > KopiIterable > KopiStream

interface KopiIterable<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<TResult>;
  filter(func: KopiFunction, context: Context): KopiStream<TResult>;
  take(count: KopiNumber): KopiStream<TResult>;
}

function makeIterable<TIterable extends AsyncIterable<TResult>, TResult extends KopiValue>(
  Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<TResult>;
  }
) {
  class KopiIterable {
    map(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          yield func.apply(KopiTuple.empty, [value, context]);
        }
      }.apply(this);

      return new Stream(generator);
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
  }

  return KopiIterable;
}

export default makeIterable;

export {
  type KopiIterable,
};
