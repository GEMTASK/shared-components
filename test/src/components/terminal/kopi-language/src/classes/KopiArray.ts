import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiBoolean from './KopiBoolean';
import KopiTuple from './KopiTuple';
import KopiRange from './KopiRange';
import KopiFunction from './KopiFunction';

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
  ArrayStream = result.KopiStream_T(fromIterable);

  import('./KopiIterable').then((result) => {
    ArrayIterable = result.KopiIterable_T(ArrayStream, fromIterable);

    KopiArray.prototype.map = ArrayIterable.prototype.map;
    KopiArray.prototype.flatMap = ArrayIterable.prototype.flatMap;
    KopiArray.prototype.filter = ArrayIterable.prototype.filter;
    KopiArray.prototype.reduce = ArrayIterable.prototype.reduce;
    KopiArray.prototype.take = ArrayIterable.prototype.take;
    KopiArray.prototype.skip = ArrayIterable.prototype.skip;
    KopiArray.prototype.repeat = ArrayIterable.prototype.repeat;
    KopiArray.prototype.join = ArrayIterable.prototype.join;
    KopiArray.prototype.count = ArrayIterable.prototype.count;
    KopiArray.prototype.splitOn = ArrayIterable.prototype.splitOn;
    KopiArray.prototype.splitAt = ArrayIterable.prototype.splitAt;
    KopiArray.prototype.splitEvery = ArrayIterable.prototype.splitEvery;

    KopiArray.prototype.combos = ArrayIterable.prototype.combos;
    KopiArray.prototype.some = ArrayIterable.prototype.some;
    KopiArray.prototype.every = ArrayIterable.prototype.every;
    KopiArray.prototype.find = ArrayIterable.prototype.find;
    KopiArray.prototype.includes = ArrayIterable.prototype.includes;
  });
});

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let elements: KopiValue[] = [];

  for await (const element of iterable) {
    elements = [...elements, await element]; // TODO: need await?
  }

  return new KopiArray(elements);
}

//
// class KopiArray
//

class KopiArray extends KopiValue implements AsyncIterable<KopiValue> {
  // static readonly emptyValue = () => new KopiArray([]);

  static async inspect() {
    return `Array`;
  }

  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    return fromIterable(iterable);
  }

  elements: (KopiValue | Promise<KopiValue>)[];

  constructor(elements: (KopiValue | Promise<KopiValue>)[]) {
    super();

    this.elements = elements;

    Object.defineProperty(this, 'size', {
      get: () => new KopiNumber(this.elements.length)
    });

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

  async toString() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).toString())
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

  async at(index: KopiNumber | KopiRange) {
    if (index instanceof KopiRange) {
      const [from, to] = await Promise.all([
        index.from,
        index.to
      ]);

      if (from instanceof KopiNumber && to instanceof KopiNumber) {
        return new KopiArray(this.elements.slice(from.value, to.value));
      }

      throw new Error('Array at range must be numeric.');
    }

    return this.elements[index.value] ?? KopiTuple.empty;
  }

  async toArray() {
    return this;
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

  '++'(that: KopiArray) {
    return new KopiArray(this.elements.concat(that.elements));
  }

  zip(_func: Function | KopiTuple, context: Context) {
    const func = _func instanceof KopiTuple
      ? function (arg: KopiValue) { return arg; }
      : _func;

    const result = (async function* map(this: KopiArray) {
      const iters = await Promise.all(
        this.elements.map(async (element) => {
          const resolvedElement = await element;

          const iterFunc = resolvedElement[Symbol.asyncIterator];

          if (!iterFunc) {
            throw new TypeError(`Value ${await resolvedElement.inspect()} does not have an asyncIterator.`);
          }

          return iterFunc.apply(resolvedElement, []);
        })
      );

      let results = await Promise.all(
        iters.map(iter => iter.next())
      );

      while (results.every(result => !result.done)) {
        yield func.apply(KopiTuple.empty, [new KopiTuple(results.map(result => result.value)), context]);

        results = await Promise.all(
          iters.map(iter => iter.next())
        );
      }
    }).apply(this);

    return new ArrayStream(result);
  }

}

export default KopiArray;
