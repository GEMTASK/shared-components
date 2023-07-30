import { Context, KopiValue, ReactElement } from '../types';
import KopiFunction from './KopiFunction';

import KopiIterable, { IKopiIterable } from './KopiIterable';
import KopiNumber from './KopiNumber';

interface IKopiStream<TResult extends KopiValue> {
  map(func: KopiFunction, context: Context): IKopiStream<TResult>;
  filter(func: KopiFunction, context: Context): IKopiStream<TResult>;
  take(count: KopiNumber): IKopiStream<TResult>;
}

const KopiStream = <TResult extends KopiValue>(
  _from?: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>
) => {
  interface KopiStream extends KopiValue, IKopiIterable<TResult> { };
  class KopiStream extends KopiValue implements AsyncIterable<KopiValue> {
    readonly iterable: AsyncIterable<KopiValue>;
    readonly from?: (iterable: AsyncIterable<KopiValue>) => Promise<TResult>;

    constructor(
      iterable: AsyncIterable<KopiValue>,
      from: ((iterable: AsyncIterable<KopiValue>) => Promise<TResult>) | undefined = _from
    ) {
      super();

      this.iterable = iterable;
      this.from = from;
    }

    override async inspect(): Promise<string | ReactElement> {
      if (_from) {
        return (await _from(this)).inspect();
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
  }

  const StreamIterable = KopiIterable(KopiStream);

  KopiStream.prototype.map = StreamIterable.prototype.map;

  return KopiStream;
};

export default KopiStream;

export {
  type IKopiStream,
};
