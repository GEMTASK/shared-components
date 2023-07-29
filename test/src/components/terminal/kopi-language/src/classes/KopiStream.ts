import { Context, KopiValue, ReactElement } from '../types';
import KopiFunction from './KopiFunction';

import KopiIterable, { IKopiIterable, KopiIterable2 } from './KopiIterable';
import KopiNumber from './KopiNumber';

interface IKopiStream<FromResultType extends KopiValue> {
  map(func: KopiFunction, context: Context): IKopiStream<FromResultType>;
  filter(func: KopiFunction, context: Context): IKopiStream<FromResultType>;
  take(count: KopiNumber): IKopiStream<FromResultType>;
}

const KopiStream2 = <TFromResult extends KopiValue>(
  _from?: (asyncIterable: AsyncIterable<KopiValue>) => Promise<TFromResult>
) => {
  interface KopiStream extends KopiValue, IKopiIterable<TFromResult> { };
  class KopiStream extends KopiValue implements AsyncIterable<KopiValue> {
    readonly asyncIterable: AsyncIterable<KopiValue>;
    readonly from?: (asyncIterable: AsyncIterable<KopiValue>) => Promise<TFromResult>;

    constructor(
      asyncIterable: AsyncIterable<KopiValue>,
      from: ((asyncIterable: AsyncIterable<KopiValue>) => Promise<TFromResult>) | undefined = _from
    ) {
      super();

      this.asyncIterable = asyncIterable;
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
      return this.asyncIterable[Symbol.asyncIterator]();
    }
  }

  const StreamIterable = KopiIterable2(KopiStream);

  KopiStream.prototype.map = StreamIterable.prototype.map;

  return KopiStream;
};

//
//
//

class KopiStream<T extends KopiValue> extends KopiValue implements AsyncIterable<KopiValue> {
  readonly asyncIterable: AsyncIterable<KopiValue>;
  readonly from?: (asyncIterable: AsyncIterable<KopiValue>) => Promise<T>;

  Iterable = KopiIterable(this.from);

  map = this.Iterable.prototype.map;
  filter = this.Iterable.prototype.filter;
  take = this.Iterable.prototype.take;

  constructor(asyncIterable: AsyncIterable<KopiValue>, from?: (asyncIterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.asyncIterable = asyncIterable;
    this.from = from;
  }

  override async inspect(): Promise<string | ReactElement> {
    if (this.from) {
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
    return this.asyncIterable[Symbol.asyncIterator]();
  }
}

export default KopiStream;

export {
  type IKopiStream,
  KopiStream2,
};
