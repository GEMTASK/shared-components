import { KopiValue } from '../types';

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

  readonly _fields: Promise<KopiValue>[];

  override get fields() {
    return this._fields;
  }

  constructor(fields: Promise<KopiValue>[]) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this._fields = [];

      return KopiTuple.empty;
    }

    this._fields = fields;
  }

  override async inspect() {
    const fields = await Promise.all(
      this.fields.map(async (element) => `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }
}

export default KopiTuple;
