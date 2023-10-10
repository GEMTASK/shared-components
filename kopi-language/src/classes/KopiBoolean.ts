import { Context, KopiClass, KopiValue } from '../types.js';

import KopiString from './KopiString.js';
import KopiTuple from './KopiTuple.js';

class KopiBoolean extends KopiClass {
  static true = new KopiBoolean(true);
  static false = new KopiBoolean(false);

  static async apply(thisArg: void, [value, context]: [KopiValue, Context]) {
    return new KopiBoolean((await value.toString()).value === 'true' ? true : false);
  }

  readonly value: boolean;

  constructor(value: boolean) {
    super();

    this.value = value;

    if (value && KopiBoolean.true) {
      return KopiBoolean.true;
    } else if (!value && KopiBoolean.false) {
      return KopiBoolean.false;
    }
  }

  async toString() {
    return new KopiString(`${this.value ? 'true' : 'false'}`);
  }

  override async inspect() {
    return `${this.value ? 'true' : 'false'}`;
  }

  '!'(): KopiBoolean {
    return this.value ? KopiBoolean.false : KopiBoolean.true;
  }

  '=='(that: KopiBoolean) {
    return this.value === that.value ? KopiBoolean.true : KopiBoolean.false;
  }

  '!='(that: KopiBoolean) {
    return this.value !== that.value ? KopiBoolean.true : KopiBoolean.false;
  }

  succ() {
    return !this.value ? KopiBoolean.true : KopiTuple.empty;
  }
}

Object.defineProperty(KopiBoolean, 'name', {
  value: 'Boolean'
});

export default KopiBoolean;
