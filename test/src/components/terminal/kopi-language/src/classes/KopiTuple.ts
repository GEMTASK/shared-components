import { Context, KopiValue } from '../types';

import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';

import type { KopiStream } from './KopiStream';

async function fromIterable(iterable: AsyncIterable<KopiValue>) {
  let fields: KopiValue[] = [];

  for await (const element of iterable) {
    fields = [...fields, await element];
  }

  return new KopiTuple(fields);
}

let TupleStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiTuple>;
};

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiTuple>;
};

import('./KopiStream').then((result) => {
  TupleStream = result.default(fromIterable);
  ArrayStream = result.default(KopiArray.fromIterable);
});

//
//
//

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

  static async fromIterable(iterable: AsyncIterable<KopiValue>) {
    let fields: KopiValue[] = [];

    for await (const element of iterable) {
      fields = [...fields, await element];
    }

    return new KopiTuple(fields);
  }

  [key: number]: KopiValue | Promise<KopiValue>;

  _fields: (KopiValue | Promise<KopiValue>)[];

  override get fields() {
    return this._fields;
  }

  constructor(fields: (KopiValue | Promise<KopiValue>)[]) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this._fields = [];

      return KopiTuple.empty;
    }

    this._fields = fields;

    fields.forEach((field, index) => {
      this[index] = field;
    });

    Promise.all(fields).then(resolvedFields => {
      this._fields = resolvedFields;
    });
  }

  override async inspect() {
    const fields = await Promise.all(
      this.fields.map(async (element) => `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }

  map(func: KopiFunction, context: Context) {
    const result = (async function* map(this: KopiTuple) {
      const iters = await Promise.all(
        this._fields.map(async (field) => {
          const resolvedField = await field;

          const iterFunc = resolvedField[Symbol.asyncIterator];

          if (!iterFunc) {
            throw new TypeError(`Value ${await resolvedField.inspect()} does not have an asyncIterator.`);
          }

          return iterFunc.apply(resolvedField, []);
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

export default KopiTuple;
