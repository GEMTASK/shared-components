const {
  Any: KopiAny,
  Array: KopiArray,
  Number: KopiNumber,
} = window.environment;

class KopiVector extends KopiAny {
  static inspect() {
    return `Vector`;
  }

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

  async '+'(that) {
    const results = [];

    for (let i = 0; i < this._elements.length; ++i) {
      results[i] = new KopiNumber(
        (await this._elements[i]).value + (await that._elements[i]).value
      );
    }

    return new KopiArray(results);
  }
}

export {
  KopiVector as Vector,
};
