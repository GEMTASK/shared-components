import { Context, KopiValue } from '../types';

import KopiNumber from './KopiNumber';
import KopiArray from './KopiArray';
import KopiFunction from './KopiFunction';
import KopiTuple from './KopiTuple';
import { IKopiStream, KopiStream2 } from './KopiStream';

async function from(iterable: AsyncIterable<KopiValue>) {
  let values: string = '';

  for await (const element of iterable) {
    values += await element.toString();
  }

  return new KopiString(values);
}

const StringStream = KopiStream2(from);

class KopiString extends KopiValue {
  readonly value: string;

  constructor(value: string) {
    super();

    this.value = value;
  }

  override async toString() {
    return this.value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.value) {
      yield new KopiString(value);
    }
  }

  static async from(iterable: AsyncIterable<KopiValue>) {
    let values: string = '';

    for await (const element of iterable) {
      values += await element.toString();
    }

    return new KopiString(values);
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  toUpper() {
    return new KopiString(this.value.toLocaleUpperCase());
  }

  trim() {
    return new KopiString(this.value.trim());
  }

  apply(thisArg: this, [that]: [that: this]) {
    return new KopiString(this.value.concat(that.value));
  }

  //

  map(func: KopiFunction, context: Context): IKopiStream<KopiString> {
    const generator = async function* (this: KopiString) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new StringStream(generator);
  }

  split(delimeter: KopiString | KopiTuple) {
    if (delimeter instanceof KopiTuple) {
      return new KopiArray(
        this.value.split('').map(string => new KopiString(string))
      );
    }

    return new KopiArray(
      this.value.split(delimeter.value).map(string => new KopiString(string))
    );
  }

  reduce(value: KopiValue) {
    return async (func: KopiFunction, context: Context) => {
      let accum: KopiValue | Promise<KopiValue> = value;

      for await (const value of this) {
        accum = func.apply(KopiTuple.empty, [new KopiTuple([accum, value]), context]);
      }

      return accum;
    };
  }
}

export default KopiString;
