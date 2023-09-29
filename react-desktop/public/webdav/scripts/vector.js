const {
  Any: KopiAny,
  Array: KopiArray,
  Number: KopiNumber,
  Tuple: KopiTuple,
} = window.environment;

class KopiVector extends KopiAny {
  static async apply(thisArg, [iterable, context]) {
    const array = await KopiArray.fromIterable(iterable);

    return new KopiVector(
      array._elements.map(element => element.value)
    );
  }

  constructor(elements = []) {
    super();

    this._elements = new Float64Array(elements);
  }

  inspect() {
    const elements = this._elements.map(element => `${element}`);

    return `Vector [${elements.join(', ')}]`;
  }

  at(index) {
    const value = this._elements[index.value];

    return value ? new KopiNumber(value) : KopiTuple.empty;
  }

  '+'(that) {
    const length = Math.min(this._elements.length, that._elements.length);

    for (let i = 0; i < length; i += 4) {
      this._elements[i + 0] += that._elements[i + 0];
      this._elements[i + 1] += that._elements[i + 1];
      this._elements[i + 2] += that._elements[i + 2];
      this._elements[i + 3] += that._elements[i + 3];
    }

    return new KopiVector(this._elements);
  }
}

Object.defineProperty(KopiVector, 'name', {
  value: 'Vector'
});

export {
  KopiVector as Vector,
};
