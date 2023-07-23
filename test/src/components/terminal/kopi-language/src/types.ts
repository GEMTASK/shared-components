import React from 'react';

const spaces = (level: number) => {
  return '  '.repeat(level);
};

const inspect = (value: unknown, level: number = 0): string => {
  if (Array.isArray(value)) {
    const props = value.map((value) => `${spaces(level + 1)}${inspect(value, level + 1)}`);

    return value.length === 0
      ? `[]`
      : `[\n${props.join(',\n')}\n${spaces(level)}]`;
  }
  else if (typeof value === 'object') {
    const props = Object.entries(value ?? {}).map(
      ([name, value]) => `${spaces(level + 1)}${name}: ${inspect(value, level + 1)}`
    );

    return props.length === 0
      ? '{}'
      : `${value?.constructor.name} {\n${props.join(',\n')}\n${spaces(level)}}`;
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else if (typeof value === 'symbol') {
    return `Symbol(${value.description})`;
  } else if (typeof value === 'function') {
    return value.constructor.name;
  }

  return `${value}`;
};

//

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
  abstract match(
    value: KopiValue,
    context: Context,
  ): Promise<{ [name: string]: KopiValue; } | undefined>;
}

class KopiValue {
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
  inspect,
  type RawASTNode,
  Environment,
  type Transform,
  type Evaluate,
  type Context,
  ASTNode,
  ASTPatternNode,
  KopiValue,
};
