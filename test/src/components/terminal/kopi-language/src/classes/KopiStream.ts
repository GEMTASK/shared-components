import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';

interface Iterable<T extends KopiValue> {
  [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

  // map(func: KopiFunction, context: Context): KopiStream<T>;
  // filter(func: KopiFunction, context: Context): KopiStream<T>;
  take(count: KopiNumber): KopiStream<T>;
}

function makeIterable<TIterable extends Iterable<TKopiValue>, TKopiValue extends KopiValue>(
  from?: (iterable: AsyncIterable<KopiValue>) => Promise<TKopiValue>
) {
  abstract class Mixin implements Iterable<TKopiValue> {
    abstract [Symbol.asyncIterator](): AsyncIterator<KopiValue>;

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
  }

  return Mixin;
}

class KopiStream<T extends KopiValue = any> extends KopiValue implements Iterable<T> {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  take: (count: KopiNumber) => KopiStream<T>;

  constructor(iterable: AsyncIterable<KopiValue>, from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;

    const cls = makeIterable(this.from);

    this.take = cls.prototype.take;
  }

  // TODO: Reproduce React.ReactElement type
  override async inspect(): Promise<string | any> {
    if (this.from) {
      console.log(this.from);
      return (await this.from(this)).inspect();
    }

    const array = [];
    let index = 0;

    for await (const value of this) {
      if (++index > 100) break;

      array.push(value);
    }

    const elements = await Promise.all(
      array.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}${index > 100 ? ', ...' : ''}]`;
  }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  map(func: KopiFunction, context: Context): KopiStream<T> {
    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator, this.from);
  }

  filter(func: KopiFunction, context: Context): KopiStream<T> {
    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        if ((await func.apply(KopiTuple.empty, [value, context]) as KopiNumber).value) {
          yield value;
        }
      }
    }.apply(this);

    return new KopiStream(generator, this.from);
  }

  // take(count: KopiNumber) {
  //   let index = 0;

  //   const generator = async function* (this: KopiStream<T>) {
  //     for await (const value of this) {
  //       if (++index <= count.value) {
  //         yield value;
  //       } else {
  //         break;
  //       }
  //     }
  //   }.apply(this);

  //   return new KopiStream(generator, this.from); // TODO
  // }
}

export default KopiStream;

export {
  type Iterable,
};
