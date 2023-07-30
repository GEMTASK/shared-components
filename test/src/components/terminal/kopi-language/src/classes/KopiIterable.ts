import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import { IKopiStream } from './KopiStream';

// TODO: Avoid recursive imports KopiStream > KopiIterable > KopiStream

interface IKopiIterable<FromResultType extends KopiValue> {
  map(func: KopiFunction, context: Context): IKopiStream<FromResultType>;
  filter(func: KopiFunction, context: Context): IKopiStream<FromResultType>;
  take(count: KopiNumber): IKopiStream<FromResultType>;
}

function KopiIterable2<AsyncIterableType extends AsyncIterable<FromResultType>, FromResultType extends KopiValue>(
  Stream: {
    new(
      asyncIterable: AsyncIterable<KopiValue>,
      from?: (asyncIterable: AsyncIterable<KopiValue>) => Promise<FromResultType>
    ): KopiValue & IKopiIterable<FromResultType>;
  }
) {
  abstract class KopiIterable {
    map(this: AsyncIterableType, func: KopiFunction, context: Context) {
      const generator = async function* (this: AsyncIterableType) {
        for await (const value of this) {
          yield func.apply(KopiTuple.empty, [value, context]);
        }
      }.apply(this);

      return new Stream(generator);
    }

    take(this: AsyncIterableType, count: KopiNumber) {
      let index = 0;

      const generator = async function* (this: AsyncIterableType) {
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

    filter(this: AsyncIterableType, func: KopiFunction, context: Context) {
      const generator = async function* (this: AsyncIterableType) {
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

// export default KopiIterable;

export {
  type IKopiIterable,
  KopiIterable2,
};
