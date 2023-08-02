import { KopiValue } from '../types';

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
  ArrayStream = result.default(KopiArray.fromIterable);

  import('./KopiIterable').then((result) => {
    ArrayIterable = result.default(ArrayStream);

    KopiArray.prototype.map = ArrayIterable.prototype.map;
    KopiArray.prototype.filter = ArrayIterable.prototype.filter;
    KopiArray.prototype.reduce = ArrayIterable.prototype.reduce;
    KopiArray.prototype.take = ArrayIterable.prototype.take;
    KopiArray.prototype.repeat = ArrayIterable.prototype.repeat;
    KopiArray.prototype.join = ArrayIterable.prototype.join;
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
}

export default KopiArray;
