import { Context, KopiValue } from '../types';

class KopiBoolean extends KopiValue {
  static true = new KopiBoolean(true);
  static false = new KopiBoolean(false);

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
    return `${this.value ? 'true' : 'false'}`;
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

export default KopiBoolean;
