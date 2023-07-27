import { ASTNode, ASTPatternNode, Context, Environment, KopiValue } from './types';
import { Identifier } from './astnodes';

class KopiNumber extends KopiValue {
  static readonly PI: KopiNumber = new KopiNumber(Math.PI);
  static readonly E: KopiNumber = new KopiNumber(Math.E);

  readonly value: number;

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  toFixed(digits: KopiNumber) {
    return new KopiString(this.value.toFixed(digits.value));
  }

  abs() {
    return new KopiNumber(Math.abs(this.value));
  }

  floor() {
    return new KopiNumber(Math.floor(this.value));
  }

  round() {
    return new KopiNumber(Math.round(this.value));
  }

  ceil() {
    return new KopiNumber(Math.ceil(this.value));
  }

  //
  // Arithmetic
  //

  '+'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value + that.value);
  }

  '-'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value - that.value);
  }

  '*'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value * that.value);
  }

  '/'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value / that.value);
  }

  '%'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new TypeError(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value % that.value);
  }

  //
  // Trigonometry
  //

  sin() {
    return new KopiNumber(Math.sin(this.value));
  }

  cos() {
    return new KopiNumber(Math.cos(this.value));
  }
}

//
//
//

class KopiStream<T extends KopiValue> extends KopiValue {
  readonly iterable: AsyncIterable<KopiValue>;
  readonly from: (iterable: AsyncIterable<KopiValue>) => Promise<T>;

  constructor(iterable: AsyncIterable<KopiValue>, from: (iterable: AsyncIterable<KopiValue>) => Promise<T>) {
    super();

    this.iterable = iterable;
    this.from = from;
  }

  override async inspect() {
    return (await this.from(this.iterable)).inspect();
  }

  [Symbol.asyncIterator]() {
    return this.iterable[Symbol.asyncIterator]();
  }

  map(func: KopiFunction, context: Context): KopiStream<T> {
    const generator = async function* (this: KopiStream<T>) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator, this.from);
  }
}

//
//
//

class KopiString extends KopiValue {
  readonly value: string;

  constructor(value: string, withIterator = true) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `"${this.value}"`;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.value) {
      yield new KopiString(value);
    }
  }

  static async from(iterable: AsyncIterable<KopiValue>) {
    let values: string = '';

    for await (const element of iterable) {
      values += (element as KopiString).value;
    }

    return new KopiString(values);
  }

  size() {
    return new KopiNumber(this.value.length);
  }

  toUpperCase() {
    return new KopiString(this.value.toLocaleUpperCase());
  }

  trim() {
    return new KopiString(this.value.trim());
  }

  map(func: KopiFunction, context: Context): KopiStream<KopiString> {
    const generator = async function* (this: KopiString) {
      for await (const value of this) {
        yield func.apply(KopiTuple.empty, [value, context]);
      }
    }.apply(this);

    return new KopiStream(generator, KopiString.from);
  }

  // split() {
  //   return new KopiString(this.value.split(''))
  // }

  // "abc" | reduce 1 (acc, n) => acc * n
  reduce(value: KopiValue) {
    return (func: KopiValue) => {
      console.log(value, func);
      return new KopiString(`String.reduce with curried parameters.`);
    };
  }
}

//
//
//

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

  readonly _fields: Promise<KopiValue>[];

  override get fields() {
    return this._fields;
  }

  constructor(fields: Promise<KopiValue>[]) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this._fields = [];

      return KopiTuple.empty;
    }

    this._fields = fields;
  }

  override async inspect() {
    const fields = await Promise.all(
      this.fields.map(async (element) => `${await (await element).inspect()}`)
    );

    return `(${fields.join(', ')})`;
  }
}

//
//
//

class KopiFunction extends KopiValue {
  readonly parameterPattern: ASTPatternNode;
  readonly bodyExpression: ASTNode;
  readonly environment: Environment;
  readonly name?: string;

  constructor(
    parameterPattern: ASTPatternNode,
    bodyExpression: ASTNode,
    environment: Environment,
    name?: string
  ) {
    super();

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.environment = environment;
    this.name = name;
  }

  async inspect() {
    return `<function>`;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment, evaluate, bind } = context;

    const matches = await this.parameterPattern.match(argument, context);

    const newEnvironment = new Environment({
      ...this.environment,
      ...matches,
      ...(this.name && { [this.name]: this }),
      'this': thisArg
    });

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment, bind);
  }
}

//
//
//

class KopiAstLiteral extends KopiValue {
  readonly value: ASTNode;

  constructor(value: ASTNode) {
    super();

    this.value = value;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return argument.invoke((this.value as Identifier).name, [KopiTuple.empty, context]);
  }
}

//
// 
//

class KopiArray extends KopiValue {
  // static readonly emptyValue = () => new KopiArray([]);

  elements: Promise<KopiValue>[];

  constructor(elements: Promise<KopiValue>[]) {
    super();

    this.elements = elements;
  }

  override async inspect() {
    const elements = await Promise.all(
      this.elements.map(async element => (await element).inspect())
    );

    return `[${elements.join(', ')}]`;
  }
}

export {
  KopiNumber,
  KopiString,
  KopiTuple,
  KopiFunction,
  KopiAstLiteral,
  KopiArray,
};
