import { KopiValue } from './types';

class KopiNumber extends KopiValue {
  readonly value: number;

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  '+'(that: KopiValue) {
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value + that.value);
    }

    throw new Error();
  }

  '-'(that: KopiValue) {
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value - that.value);
    }

    throw new Error();
  }
}

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

  readonly fields: Promise<KopiValue>[];

  constructor(fields: Promise<KopiValue>[]) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this.fields = [];

      return KopiTuple.empty;
    }

    this.fields = fields;
  }

  override async inspect() {
    const fields = await Promise.all(
      this.fields.map(async (element) => `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }
}

export {
  KopiNumber,
  KopiTuple,
};
