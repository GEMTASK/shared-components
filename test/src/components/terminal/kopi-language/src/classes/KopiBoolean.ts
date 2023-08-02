import { Context, KopiValue } from '../types';

class KopiBoolean extends KopiValue {
  readonly value: boolean;

  constructor(value: boolean) {
    super();

    this.value = value;
  }

  async toString() {
    return `${this.value ? 'true' : 'false'}`;
  }

  override async inspect() {
    return `${this.value ? 'true' : 'false'}`;
  }
}

export default KopiBoolean;
