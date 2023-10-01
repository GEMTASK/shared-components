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

KopiVector.applyGravity2D = (tuple) => {
  const positions = tuple.fields[0]._elements;
  const velocities = tuple.fields[1]._elements;

  const length = Math.min(positions.length, velocities.length);

  for (let i = 0; i < length; i += 2) {
    for (let j = i + 2; j < length; j += 2) {
      const force = 1 / Math.sqrt(
        Math.abs(positions[i + 0] - positions[j + 0])
        * Math.abs(positions[i + 1] - positions[j + 1])
      ) ** 2;

      velocities[i + 0] += force;
      velocities[i + 1] += force;

      velocities[j + 0] -= force;
      velocities[j + 1] -= force;
    }

    positions[i + 0] += velocities[i + 0];
    positions[i + 1] += velocities[i + 1];
  }

  return new KopiTuple([new KopiVector(positions), new KopiVector(velocities)]);
};

export {
  KopiVector as Vector,
};
