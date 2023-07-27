import { KopiValue } from '../types';

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

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
}

export default KopiTuple;
