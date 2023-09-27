const {
  Any: KopiAny,
  Array: KopiArray,
  Number: KopiNumber,
  Tuple: KopiTuple,
} = window.environment;

class KopiVector extends KopiAny {
  static async apply(thisArg, [iterable, context]) {
    const array = await KopiArray.fromIterable(iterable);

    return new KopiVector(array._elements);
  }

  constructor(elements) {
    super();

    this._elements = elements;
  }

  async inspect() {
    const elements = await Promise.all(
      this._elements.map(async element => (await element).inspect())
    );

    return `Vector [${elements.join(', ')}]`;
  }

  async at(index) {
    return this._elements[index.value] ?? KopiTuple.empty;
  }

  async '+'(that) {
    const results = [];

    for (let i = 0; i < this._elements.length; ++i) {
      results[i] = new KopiNumber(
        (await this._elements[i]).value + (await that._elements[i]).value
      );
    }

    return new KopiVector(results);
  }
}

Object.defineProperty(KopiVector, 'name', {
  value: 'Vector'
});

export {
  KopiVector as Vector,
};
