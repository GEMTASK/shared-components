import React from 'react';

import { inspect } from './utils';

interface KopiValue {
  [Symbol.asyncIterator]?(): AsyncIterator<KopiValue>;
}

abstract class KopiValue {
  // async _toString() {
  //   return `${this}`;
  // }

  async inspect(): Promise<string | React.ReactElement> {
    return inspect(this);
  }

  get fields(): (KopiValue | Promise<KopiValue>)[] {
    return [this];
  }

  async invoke(
    methodName: string,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const method = (this as any)[methodName];

    if (method) {
      return await method.apply(this, [argument, context]);
    }

    throw new Error(`No method named "${methodName}" found in ${await this.inspect()}.`);
  }
}

interface RawASTNode {
  [key: string]: any;
}

class ASTNode {
  location: {} = {};

  constructor(location: {}) {
    this.location = {};
  }
}

abstract class ASTPatternNode extends ASTNode {
  abstract match(value: KopiValue, context: Context): Promise<{
    [name: string]: KopiValue;
  } | undefined>;
}

// interface Environment {
//   [name: string | symbol]: KopiValue;
// }

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
  ASTNode,
  ASTPatternNode,
  Environment,
  KopiValue,
};
