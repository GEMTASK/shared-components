import { Context, KopiValue } from '../types.js';

import KopiArray from './KopiArray.js';
import KopiBoolean from './KopiBoolean.js';
import KopiNumber from './KopiNumber.js';
import KopiString from './KopiString.js';

import KopiTuple from './KopiTuple.js';

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
}

Object.defineProperty(KopiAny, 'name', {
  value: 'Any'
});

export default KopiAny;
