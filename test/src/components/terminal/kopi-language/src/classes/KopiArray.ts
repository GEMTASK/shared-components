import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiBoolean from './KopiBoolean';

import type { KopiStream } from './KopiStream';
import type { KopiIterable } from './KopiIterable';

interface KopiArray extends KopiValue, KopiIterable<KopiArray> { };

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let ArrayIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream').then((result) => {
  ArrayStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable').then((result) => {
    ArrayIterable = result.KopiIterable_T(ArrayStream);

    KopiArray.prototype.map = ArrayIterable.prototype.map;
    KopiArray.prototype.flatMap = ArrayIterable.prototype.flatMap;
    KopiArray.prototype.filter = ArrayIterable.prototype.filter;
    KopiArray.prototype.reduce = ArrayIterable.prototype.reduce;
    KopiArray.prototype.take = ArrayIterable.prototype.take;
    KopiArray.prototype.skip = ArrayIterable.prototype.skip;
    KopiArray.prototype.repeat = ArrayIterable.prototype.repeat;
    KopiArray.prototype.join = ArrayIterable.prototype.join;
    KopiArray.prototype.combos = ArrayIterable.prototype.combos;
    KopiArray.prototype.some = ArrayIterable.prototype.some;
    KopiArray.prototype.every = ArrayIterable.prototype.every;
    KopiArray.prototype.find = ArrayIterable.prototype.find;
    KopiArray.prototype.count = ArrayIterable.prototype.count;
  });
});

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let elements: KopiValue[] = [];

  for await (const element of iterable) {
    elements = [...elements, await element];
  }

  return new KopiArray(elements);
}

//
//
//

class KopiArray extends KopiValue implements AsyncIterable<KopiValue> {
  // static readonly emptyValue = () => new KopiArray([]);

  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    return fromIterable(iterable);
  }

  elements: (KopiValue | Promise<KopiValue>)[];

  constructor(elements: (KopiValue | Promise<KopiValue>)[]) {
    super();

    this.elements = elements;

    Promise.all(elements).then(resolvedElements => {
      this.elements = resolvedElements;
    });
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.elements) {
      yield value;
    }
  }

  size() {
    return new KopiNumber(this.elements.length);
  }

  empty() {
    return new KopiBoolean(this.elements.length === 0);
  }

  //

  async '=='(that: KopiArray, context: Context) {
    if (!(that instanceof KopiArray) || that.elements.length !== this.elements.length) {
      return new KopiBoolean(false);
    }

    for (let index = 0; index < this.elements.length; ++index) {
      const thisValue = await this.elements[index];
      const thatValue = await that.elements[index];

      const result = await thisValue.invoke('==', [thatValue, context]);

      if (!(result as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }
}

export default KopiArray;
