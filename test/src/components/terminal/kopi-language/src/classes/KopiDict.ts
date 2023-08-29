import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiBoolean from './KopiBoolean';
import KopiTuple from './KopiTuple';
import KopiRange from './KopiRange';
import KopiFunction from './KopiFunction';
import KopiString from './KopiString';
import KopiArray from './KopiArray';

import type { KopiStream } from './KopiStream';
import type { KopiIterable } from './KopiIterable';

// Dict [(1, "One"), (2, "Two")]
// {1: "One"} << {2: "Two"}

async function fromIterable(iterable: AsyncIterable<KopiTuple>) {
  let entries: [string, [KopiValue, KopiValue]][] = [];

  for await (const entry of iterable) {
    entries = [
      ...entries,
      [await (await entry.fields[0]).inspect() as string, [await entry.fields[0], await entry.fields[1]]]
    ];
  }

  return new KopiDict(entries);
}

class KopiDict extends KopiValue implements AsyncIterable<KopiValue> {
  static async fromIterable(iterable: AsyncIterable<KopiTuple>) {
    return fromIterable(iterable);
  }

  map: Map<string, [KopiValue, KopiValue | Promise<KopiValue>]>;

  constructor(entries: [string, [KopiValue, (KopiValue | Promise<KopiValue>)]][]) {
    super();

    this.map = new Map(entries.map(([key, value]) => [
      key,
      value
    ]));
  }

  toString() {
    return ``;
  }

  override async inspect() {
    const entries: string[] = [];

    for (const [_, [key, value]] of this.map) {
      entries.push(`${await key.inspect()}: ${await (await value).inspect()}`);
    }

    return `{ ${entries.join(', ')} }`;
  }

  async *[Symbol.asyncIterator]() {
    for (const [_, [key, value]] of this.map) {
      yield new KopiTuple([key, await value]);
    }
  }

  async at(key: KopiValue) {
    const value = this.map.get(await key.inspect() as string);

    if (value) {
      return value[1];
    }

    return KopiTuple.empty;
  }

  async merge(that: KopiDict) {
    return new KopiDict([...this.map, ...that.map]);
  }

  async '<<'(that: KopiDict) {
    return this.merge(that);
  }
}

export default KopiDict;
