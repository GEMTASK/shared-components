import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import KopiStream, { KopiStream2 } from './KopiStream';

// TODO: Avoid recursive imports KopiStream > KopiIterable > KopiStream

function KopiIterable<TIterable extends AsyncIterable<TFromResult>, TFromResult extends KopiValue>(
  from?: (iterable: AsyncIterable<KopiValue>) => Promise<TFromResult>,
) {
  // const Stream = KopiStream2(from);

  abstract class KopiIterable {
    map(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          yield func.apply(KopiTuple.empty, [value, context]);
        }
      }.apply(this);

      return new KopiStream(generator, from);
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

      return new KopiStream(generator, from);
    }

    filter(this: TIterable, func: KopiFunction, context: Context) {
      const generator = async function* (this: TIterable) {
        for await (const value of this) {
          if ((await func.apply(KopiTuple.empty, [value, context]) as KopiNumber).value) {
            yield value;
          }
        }
      }.apply(this);

      return new KopiStream(generator, from);
    }
  }

  return KopiIterable;
}

export default KopiIterable;
