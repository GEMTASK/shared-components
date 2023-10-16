/* eslint-disable no-extend-native */

import { KopiString } from './classes/index.js';
import { inspect } from './utils.js';

type ReactElement = {
  type: (props: object) => ReactElement;
  props: object;
  key: string | number | null;
};

interface KopiClass {
  [Symbol.asyncIterator]?(): AsyncIterator<KopiValue>;
}

abstract class KopiClass {
  async toString() {
    return new KopiString(Object.prototype.toString.apply(this));
  }

  async toNativeString() {
    return (await this.toString()).value;
  }

  async inspect(): Promise<string | ReactElement> {
    return inspect(this);
  }

  get fields(): (KopiValue | Promise<KopiValue>)[] {
    return [this];
  }

  async invoke(
    thisArg: any,
    methodSymbol: symbol,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment } = context ?? {};

    const extensions = environment?._extensions as unknown as Map<Function, any>;
    const extensionMethods = extensions?.get(this.constructor);

    const classMethods = Object.getPrototypeOf(this);

    const method = extensionMethods?.[methodSymbol]
      ?? extensionMethods?.[methodSymbol.description as any]
      ?? classMethods[methodSymbol]
      ?? classMethods[methodSymbol.description as any];

    if (method) {
      return method.apply(thisArg, [argument, context]);
    }

    throw new ReferenceError(
      `No method named "${methodSymbol.description}" found in value ${await thisArg.inspect()}.`
    );
  }
}

type KopiValue = KopiClass | number;

declare global {
  interface FunctionConstructor {
    // traits: KopiTrait[];
  }

  interface Function {
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    toString(): Promise<KopiString>;
    toNativeString(): Promise<string>;
    invoke(
      thisArg: any,
      methodSymbol: symbol,
      [argument, context]: [KopiValue, Context]
    ): Promise<KopiValue>;
  }

  interface Number {
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    toNativeString(): Promise<string>;
    invoke(
      thisArg: any,
      methodSymbol: symbol,
      [argument, context]: [KopiValue, Context]
    ): Promise<KopiValue>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(
    this.constructor === Function
      ? this.name
      : '<native-function>'
  );
};

Object.defineProperty(Function.prototype, 'fields', {
  get() {
    return [this.valueOf()];
  }
});

Number.prototype.inspect = async function () {
  return this.toString();
};

Number.prototype.toNativeString = async function () {
  return this.toString();
};

Object.defineProperty(Number.prototype, 'fields', {
  get() {
    return [this.valueOf()];
  }
});

interface RawASTNode {
  [key: string]: any;
}

class ASTNode extends KopiClass {
  location: object = {};

  constructor(location: {}) {
    super();

    this.location = {};
  }
}

abstract class ASTPatternNode extends ASTNode {
  abstract test(value: KopiValue, context: Context): Promise<boolean>;

  abstract match(value: KopiValue, context: Context): Promise<{
    [name: string]: KopiValue;
  } | undefined>;
}

type Environment = {
  [key: string | symbol]: KopiValue;

  // constructor(bindings: { [key: string | symbol]: KopiValue; }) {
  //   Object.entries(bindings).map(([key, binding]) => this[key] = binding);
  // }

  // bind(bindings: Environment) {
  //   return new Environment({ ...this, ...bindings });
  // }
};

type Transform = (rawASTNode: RawASTNode) => ASTNode;
type Evaluate = (astNode: ASTNode, environment: Environment, bind: Bind) => Promise<KopiValue>;
type Bind = (bindings: { [name: string]: KopiValue; }) => void;

type Context = {
  environment: Environment,
  evaluate: Evaluate,
  bind: Bind,
};

export {
  type RawASTNode,
  type Transform,
  type Evaluate,
  type Environment,
  type Bind,
  type Context,
  type ReactElement,
  type KopiValue,
  ASTNode,
  ASTPatternNode,
  KopiClass,
};
