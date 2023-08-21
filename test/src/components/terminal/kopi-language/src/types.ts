/* eslint-disable no-extend-native */

import { inspect } from './utils';

type ReactElement = {
  type: (props: object) => ReactElement;
  props: object;
  key: string | number | null;
};

interface KopiValue {
  [Symbol.asyncIterator]?(): AsyncIterator<KopiValue>;
}

abstract class KopiValue {
  // async _toString() {
  //   return `${this}`;
  // }

  async inspect(): Promise<string | ReactElement> {
    return inspect(this);
  }

  get fields(): (KopiValue | Promise<KopiValue>)[] {
    return [this];
  }

  async invoke(
    methodName: string,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment } = context;

    const extensions = environment._extensions as unknown as Map<Function, any>;
    const method = (this as any)[methodName] ?? extensions.get(this.constructor)[methodName];

    if (method) {
      return await method.apply(this, [argument, context]);
    }

    throw new Error(
      `No method named "${methodName}" found in ${await this.inspect()} of type ${this.constructor.name}.`
    );
  }
}

declare global {
  interface FunctionConstructor {
    // traits: KopiTrait[];
  }

  interface Function {
    inspect(): Promise<string>;
    get fields(): Promise<KopiValue>[];
    invoke(
      methodName: string,
      [argument, context]: [KopiValue, Context]
    ): Promise<KopiValue>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(`<native-function>`);
};

interface RawASTNode {
  [key: string]: any;
}

class ASTNode extends KopiValue {
  location: {} = {};

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

class Environment {
  [key: string | symbol]: KopiValue;

  constructor(bindings: { [key: string | symbol]: KopiValue; }) {
    Object.entries(bindings).map(([key, binding]) => this[key] = binding);
  }

  // bind(bindings: Environment) {
  //   return new Environment({ ...this, ...bindings });
  // }
}

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
  type Bind,
  type Context,
  type ReactElement,
  ASTNode,
  ASTPatternNode,
  Environment,
  KopiValue,
};
