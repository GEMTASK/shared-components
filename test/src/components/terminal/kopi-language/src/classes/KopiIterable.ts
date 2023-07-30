import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import { IKopiStream } from './KopiStream';

// TODO: Avoid recursive imports KopiStream > KopiIterable > KopiStream

interface IKopiIterable<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): IKopiStream<TResult>;
  filter(func: KopiFunction, context: Context): IKopiStream<TResult>;
  take(count: KopiNumber): IKopiStream<TResult>;
}

function KopiIterable<TIterable extends AsyncIterable<TResult>, TResult extends KopiValue>(
  Stream: {
    new(
      iterable: AsyncIterable<KopiValue>,
      from?: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>
    ): KopiValue & IKopiIterable<TResult>;
  }
) {
  abstract class KopiIterable {
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

export default KopiIterable;

export {
  type IKopiIterable,
};
