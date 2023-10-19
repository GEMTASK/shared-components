import { Context, KopiValue, KopiClass } from '../types.js';

import KopiBoolean from './KopiBoolean.js';
import KopiTuple from './KopiTuple.js';
import KopiRange from './KopiRange.js';
import KopiString from './KopiString.js';

import type { KopiStream } from './KopiStream.js';
import type { KopiIterable } from './KopiIterable.js';

import { getSymbol } from '../utils.js';

const equalsSymbol = getSymbol('==');

interface KopiArray extends KopiClass, KopiIterable<KopiArray> { }

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let ArrayIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream.js').then((result) => {
  ArrayStream = result.KopiStream_T(fromIterable);

  import('./KopiIterable.js').then((result) => {
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

class KopiArray extends KopiClass implements AsyncIterable<KopiValue> {
  // static readonly emptyValue = () => new KopiArray([]);

  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    return fromIterable(iterable);
  }

  _elements: (KopiValue | Promise<KopiValue>)[];

  constructor(elements: (KopiValue | Promise<KopiValue>)[]) {
    super();

    this._elements = elements;

    Object.defineProperty(this, 'size', {
      get: () => this._elements.length
    });

    Promise.all(elements).then(resolvedElements => {
      this._elements = resolvedElements;
    });
  }

  override async inspect() {
    const elements = await Promise.all(
      this._elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }

  async toString() {
    const elements = await Promise.all(
      this._elements.map(async element => (await element).inspect())
    );

    return new KopiString(`[${elements.map(element => element).join(', ')}]`);
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this._elements) {
      yield value;
    }
  }

  size() {
    return this._elements.length;
  }

  empty() {
    return new KopiBoolean(this._elements.length === 0);
  }

  async at(index: number | KopiRange) {
    if (index instanceof KopiRange) {
      const [from, to] = await Promise.all([
        index.from,
        index.to
      ]);

      if (typeof from === 'number' && typeof to === 'number') {
        return new KopiArray(this._elements.slice(from, to));
      }

      throw new Error('Array at range must be numeric.');
    }

    return this._elements[index] ?? KopiTuple.empty;
  }

  async toArray() {
    return this;
  }

  //

  async '=='(that: KopiArray, context: Context) {
    if (!(that instanceof KopiArray) || that._elements.length !== this._elements.length) {
      return new KopiBoolean(false);
    }

    for (let index = 0; index < this._elements.length; ++index) {
      const thisValue = await this._elements[index];
      const thatValue = await that._elements[index];

      const result = await thisValue.invoke(thisValue, equalsSymbol, [thatValue, context]);

      if (!(result as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }

  async '!='(that: KopiArray, context: Context) {
    return new KopiBoolean(!((await this['=='](that, context)).value));
  }

  '++'(that: KopiArray) {
    return new KopiArray(this._elements.concat(that._elements));
  }

  zip(_func: Function | KopiTuple, context: Context) {
    const func = _func instanceof KopiTuple
      ? function (arg: KopiValue) { return arg; }
      : _func;

    const result = (async function* map(this: KopiArray) {
      const iters = await Promise.all(
        this._elements.map(async (element) => {
          const resolvedElement = await element;

          if (typeof resolvedElement === 'object') {
            const iterFunc = resolvedElement[Symbol.asyncIterator];

            if (!iterFunc) {
              throw new TypeError(`Value ${await resolvedElement.inspect()} does not have an asyncIterator.`);
            }

            return iterFunc.apply(resolvedElement, []);
          }

          throw new TypeError(`Value ${await resolvedElement.inspect()} does not have an asyncIterator.`);
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

Object.defineProperty(KopiArray, 'name', {
  value: 'Array'
});

export default KopiArray;
