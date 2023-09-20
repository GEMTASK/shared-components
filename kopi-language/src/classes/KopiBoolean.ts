import { Context, KopiValue } from '../types.js';

import KopiString from './KopiString.js';

class KopiBoolean extends KopiValue {
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
    return new KopiBoolean(!this.value);
  }

  '=='(that: KopiBoolean) {
    return new KopiBoolean(this.value === that.value);
  }

  '!='(that: KopiBoolean) {
    return new KopiBoolean(this.value !== that.value);
  }
}

Object.defineProperty(KopiBoolean, 'name', {
  value: 'Boolean'
});

export default KopiBoolean;
