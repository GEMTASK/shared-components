import { ASTNode, ASTPatternNode, Context, Environment, Evaluate, KopiValue } from './types';

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
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value + that.value);
    }

    throw new Error();
  }

  '-'(that: KopiValue) {
    if (that instanceof KopiNumber) {
      return new KopiNumber(this.value - that.value);
    }

    throw new Error();
  }
}

class KopiTuple extends KopiValue {
  static readonly empty = new KopiTuple([]);

  readonly fields: Promise<KopiValue>[];

  constructor(fields: Promise<KopiValue>[]) {
    super();

    if (fields.length === 0 && KopiTuple.empty) {
      this.fields = [];

      return KopiTuple.empty;
    }

    this.fields = fields;
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

    const newEnvironment = {
      ...this.environment,
      ...matches,
      ...(this.name ? { [this.name]: this } : {}),
      'this': thisArg
    };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment);
  }
}

export {
  KopiNumber,
  KopiTuple,
  KopiFunction,
};
