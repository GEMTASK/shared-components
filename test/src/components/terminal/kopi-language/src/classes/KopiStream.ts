import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';

class KopiStream<T extends KopiValue> extends KopiValue {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  constructor(iterable: AsyncIterable<KopiValue>, from: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;
  }

  override async inspect() {
    return (await this.from(this.iterable)).inspect();
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

  take(count: KopiNumber) {
    let index = 0;

    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        if (index++ < count.value) {
          yield value;
        } else {
          break;
        }
      }
    }.apply(this);

    return new KopiStream(generator, this.from);
  }
}

export default KopiStream;
