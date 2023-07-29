
class KopiValue { }

const KopiStream = (from) => {
  class KopiStream {
    constructor(asyncIterable) {
      this.asyncIterable = asyncIterable;
    }

    async inspect() {
      return (await from(this.asyncIterable)).inspect();
    }

    // [Symbol.asyncIterator]() {}
  }

  KopiStream.prototype.map = function (func) {
    const generator = (async function* () {
      for await (let element of this.asyncIterable) {
        yield func(element);
      }
    }).apply(this, []);

    return new KopiStream(generator);
  };

  return KopiStream;
};

class KopiArray extends KopiValue {
  static async from(asyncIterable) {
    const values = [];

    for await (let value of asyncIterable) {
      values.push(value);
    }

    return new KopiArray(values);
  }

  constructor(elements) {
    super();

    this.elements = elements;
  }

  async inspect() {
    return `[${(await Promise.all(this.elements)).join(', ')}]`;
  }
}

const ArrayStream = KopiStream(KopiArray.from);

KopiArray.prototype.map = function (func) {
  const generator = async function* () {
    for await (let element of this.elements) {
      yield func(element);
    }
  }.apply(this);

  return new ArrayStream(generator);
};

const array = new KopiArray([1, 2, 3]);

(async function main() {
  var result = await array.map(n => n * n);
  var result = await result.map(n => n * n);

  console.log('>>>', await result.inspect());
})();
