import React from 'react';

import { inspect } from './utils';

interface RawASTNode {
  [key: string]: any;
}

class ASTNode {
  location: {} = {};

  constructor(location: {}) {
    // this.location = location;
  }
}

abstract class ASTPatternNode extends ASTNode {
  abstract match(value: KopiValue, context: Context): Promise<{
    [name: string]: KopiValue;
  } | undefined>;
}

abstract class KopiValue {
  async inspect(): Promise<string | React.ReactElement> {
    return inspect(this);
  }
}

// interface Environment {
//   [name: string | symbol]: KopiValue;
// }

class Environment {
  [key: string | symbol]: KopiValue;

  constructor(bindings: { [key: string | symbol]: KopiValue; }) {
    Object.entries(bindings).map(([key, binding]) => this[key] = binding);
  }

  async inspect() {
    return 'here';
  }

  bind(bindings: Environment) {
    return new Environment({ ...this, ...bindings });
  }
}

type Transform = (rawASTNode: RawASTNode) => ASTNode;
type Evaluate = (astNode: ASTNode, environment: Environment) => Promise<KopiValue>;

type Context = {
  environment: Environment,
  evaluate: Evaluate,
  // bindValues: BindValues,
};

export {
  type RawASTNode,
  type Transform,
  type Evaluate,
  type Context,
  ASTNode,
  ASTPatternNode,
  Environment,
  KopiValue,
};
