import { Context, KopiClass, KopiValue } from '../types.js';

import KopiNumber from './KopiNumber.js';
import KopiTuple from './KopiTuple.js';
import KopiString from './KopiString.js';
import KopiArray from './KopiArray.js';
import KopiFunction from './KopiFunction.js';

import type { KopiStream } from './KopiStream.js';
import type { KopiIterable } from './KopiIterable.js';

interface KopiDict extends KopiClass, KopiIterable<KopiValue> { };

let DictStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiDict>;
};

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiArray>;
};

let DictIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiDict>;
  }): KopiIterable<KopiDict>;
};

let ArrayIterable: {
  new(Stream: {
    new(iterable: AsyncIterable<KopiValue>): KopiIterable<KopiArray>;
  }): KopiIterable<KopiArray>;
};

import('./KopiStream.js').then((result) => {
  DictStream = result.KopiStream_T(fromIterable);
  ArrayStream = result.KopiStream_T(KopiArray.fromIterable);

  import('./KopiIterable.js').then((result) => {
    DictIterable = result.KopiIterable_T(DictStream, fromIterable);
    ArrayIterable = result.KopiIterable_T(ArrayStream, KopiArray.fromIterable);

    KopiString.prototype.toArray = ArrayIterable.prototype.toArray;
    KopiDict.prototype.map = ArrayIterable.prototype.map;
    KopiDict.prototype.flatMap = ArrayIterable.prototype.flatMap;
    KopiDict.prototype.filter = DictIterable.prototype.filter;
    KopiDict.prototype.reduce = DictIterable.prototype.reduce;
    KopiDict.prototype.take = DictIterable.prototype.take;
    KopiDict.prototype.skip = DictIterable.prototype.skip;
    KopiDict.prototype.repeat = DictIterable.prototype.repeat;
    KopiDict.prototype.join = DictIterable.prototype.join;
    KopiDict.prototype.count = DictIterable.prototype.count;
    KopiDict.prototype.splitOn = DictIterable.prototype.splitOn;
    KopiDict.prototype.splitAt = DictIterable.prototype.splitAt;
    KopiDict.prototype.splitEvery = DictIterable.prototype.splitEvery;

    KopiDict.prototype.combos = DictIterable.prototype.combos;
    KopiDict.prototype.some = DictIterable.prototype.some;
    KopiDict.prototype.every = DictIterable.prototype.every;
    KopiDict.prototype.find = DictIterable.prototype.find;
    KopiDict.prototype.includes = DictIterable.prototype.includes;
  });
});

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let entries: [string, [KopiValue, KopiValue]][] = [];

  for await (const entry of iterable) {
    entries = [
      ...entries,
      [await (await entry.fields[0]).inspect() as string, [await entry.fields[0], await entry.fields[1]]]
    ];
  }

  return new KopiDict(entries);
}

//
// class KopiDict
//

class KopiDict extends KopiClass implements AsyncIterable<KopiValue> {
  static async fromIterable(iterable: AsyncIterable<KopiTuple>) {
    return fromIterable(iterable);
  }

  _map: Map<string, [KopiValue, KopiValue | Promise<KopiValue>]>;

  constructor(entries: [string, [KopiValue, (KopiValue | Promise<KopiValue>)]][]) {
    super();

    this._map = new Map(entries.map(([key, value]) => [
      key,
      value
    ]));

    Object.defineProperty(this, 'size', {
      get: () => new KopiNumber(this._map.size)
    });
  }

  async toString() {
    return new KopiString(`...`);
  }

  override async inspect() {
    const entries: string[] = [];

    for (const [_, [key, value]] of this._map) {
      entries.push(`${await key.inspect()}: ${await (await value).inspect()}`);
    }

    if (entries.length === 0) {
      return `{}`;
    }

    return `{ ${entries.join(', ')} }`;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<KopiValue> {
    for (const [_, [key, value]] of this._map) {
      yield new KopiTuple([key, await value]);
    }
  }

  size() {
    return new KopiNumber(this._map.size);
  }

  async at(key: KopiValue) {
    const value = this._map.get(await key.inspect() as string);

    if (value) {
      return value[1];
    }

    return KopiTuple.empty;
  }

  async merge(that: KopiDict) {
    return new KopiDict([...this._map, ...that._map]);
  }

  async '<<'(that: KopiDict) {
    return this.merge(that);
  }

  update(key: KopiValue) {
    return async (func: KopiFunction, context: Context) => {
      const value = this._map.get(await key.inspect() as string);

      if (value) {
        const updatedValue = func.apply(KopiTuple.empty, [await value[1], context]);

        return new KopiDict([
          ...this._map,
          [await key.inspect() as string, [key, updatedValue]]
        ]);
      } else {
        const updatedValue = func.apply(KopiTuple.empty, [KopiTuple.empty, context]);

        return new KopiDict([
          ...this._map,
          [await key.inspect() as string, [key, updatedValue]]
        ]);
      }
    };
  }
}

Object.defineProperty(KopiDict, 'name', {
  value: 'Dict'
});

export default KopiDict;
