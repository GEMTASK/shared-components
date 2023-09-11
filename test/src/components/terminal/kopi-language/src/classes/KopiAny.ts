import { Context, KopiValue } from '../types';

import KopiArray from './KopiArray';
import KopiBoolean from './KopiBoolean';
import KopiNumber from './KopiNumber';
import KopiString from './KopiString';

import KopiTuple from './KopiTuple';

function transform(value: unknown): KopiValue {
  if (value === null) {
    return KopiTuple.empty;
  } else if (Array.isArray(value)) {
    return new KopiArray(value.map(value => transform(value)));
  } else if (typeof value === 'object') {
    return new KopiTuple(
      Object.values(value).map(value => transform(value)),
      Object.keys(value)
    );
  } else if (typeof value === 'string') {
    return new KopiString(value);
  } else if (typeof value === 'number') {
    return new KopiNumber(value);
  } else if (typeof value === 'boolean') {
    return new KopiBoolean(value);
  }

  return KopiTuple.empty;
}

class KopiAny extends KopiValue {
  static fromJsonString(jsonString: KopiString) {
    const json = JSON.parse(jsonString.value);

    return transform(json);
  }

  static async inspect() {
    return 'Any';
  }
}

export default KopiAny;
