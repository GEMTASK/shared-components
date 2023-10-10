import { Context, KopiClass, KopiValue } from '../types.js';

import KopiArray from './KopiArray.js';
import KopiBoolean from './KopiBoolean.js';
import KopiFunction from './KopiFunction.js';
import KopiString from './KopiString.js';

import type { KopiStream } from './KopiStream.js';

let ArrayStream: {
  new(iterable: AsyncIterable<KopiValue>): KopiStream<KopiTuple>;
};

import('./KopiStream.js').then((result) => {
  ArrayStream = result.default(KopiArray.fromIterable);
});

//
// class KopiTuple
//

class KopiTuple extends KopiClass {
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
  _fieldNames: string[];

  override get fields() {
    return this._fields;
  }

  constructor(fields: (KopiValue | Promise<KopiValue>)[], fieldNames: string[] = []) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this._fields = [];
      this._fieldNames = fieldNames;

      return KopiTuple.empty;
    }

    this._fields = fields;
    this._fieldNames = fieldNames;

    fields.forEach((field, index) => {
      this[(this._fieldNames as any)[index]] = field;
    });

    Promise.all(fields).then(resolvedFields => {
      this._fields = resolvedFields;
    });
  }

  override async toString() {
    const fields = await Promise.all(
      this._fields.map(async (element, index) =>
        (this._fieldNames[index] ? `${this._fieldNames[index]}: ` : ``) +
        `${await (await element).inspect()}`)
    );

    return new KopiString(`(${fields.join(', ')})`);
  }

  override async inspect() {
    const fields = await Promise.all(
      this._fields.map(async (element, index) =>
        (this._fieldNames[index] ? `${this._fieldNames[index]}: ` : ``) +
        `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }

  //

  async '=='(that: KopiTuple, context: Context) {
    if (!(that instanceof KopiTuple) || that._fields.length !== this._fields.length) {
      return new KopiBoolean(false);
    }

    for (let index = 0; index < this._fields.length; ++index) {
      const thisValue = await this._fields[index];
      const thatValue = await that._fields[index];

      const result = await thisValue.invoke('==', [thatValue, context]);

      if (!(result as KopiBoolean).value) {
        return new KopiBoolean(false);
      }
    }

    return new KopiBoolean(true);
  }

  async '!='(that: KopiTuple, context: Context) {
    return new KopiBoolean(!((await this['=='](that, context)).value));
  }

  //

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

  // TODO: (1..2, "a".."b") | combinations
}

Object.defineProperty(KopiTuple, 'name', {
  value: 'Tuple'
});

export default KopiTuple;
