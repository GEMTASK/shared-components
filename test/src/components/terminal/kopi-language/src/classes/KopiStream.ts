import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import KopiArray from './KopiArray';

interface Iterable<T extends KopiValue> {
  map(func: KopiFunction, context: Context): KopiStream<T>;
  filter(func: KopiFunction, context: Context): KopiStream<T>;
  take(count: KopiNumber): KopiStream<T>;
}

class KopiStream<T extends KopiValue = any> extends KopiValue implements Iterable<T> {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  constructor(iterable: AsyncIterable<KopiValue>, from?: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;
  }

  override async inspect(): Promise<string> {
    // TODO: Need to use from()

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

  take(count: KopiNumber) {
    let index = 0;

    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        if (++index <= count.value) {
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

export {
  type Iterable,
};
