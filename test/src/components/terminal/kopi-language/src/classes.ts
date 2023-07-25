import { ASTNode, ASTPatternNode, Context, Environment, KopiValue } from './types';

function assert(value: KopiValue, type: Function, message: string) {
  if (!(value instanceof Function)) {
    throw new Error(message);
  }
}

class KopiNumber extends KopiValue {
  readonly value: number;

  constructor(value: number) {
    super();

    this.value = value;
  }

  override async inspect() {
    return `${this.value}`;
  }

  '+'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new Error(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value + that.value);
  }

  '-'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new Error(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value - that.value);
  }

  '*'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new Error(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value * that.value);
  }

  '/'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new Error(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value / that.value);
  }

  '%'(that: KopiValue) {
    if (!(that instanceof KopiNumber)) {
      throw new Error(`Right side of operation is not a number.`);
    }

    return new KopiNumber(this.value % that.value);
  }
}

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

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment, evaluate } = context;

    const matches = await this.parameterPattern.match(argument, context);

    const newEnvironment = new Environment({
      ...this.environment,
      ...matches,
      ...(this.name && { [this.name]: this }),
      'this': thisArg
    });

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment);
  }
}

export {
  KopiNumber,
  KopiTuple,
  KopiFunction,
};
