import { KopiNumber, KopiTuple } from './classes';
import { ASTNode, ASTPatternNode, Context, KopiValue } from './types';

//
// Statements
//

class AssignmentStatement extends ASTNode {
  readonly pattern: ASTPatternNode;
  readonly expression: ASTNode;

  constructor({ pattern, expression, location }: AssignmentStatement) {
    super(location);

    this.pattern = pattern;
    this.expression = expression;
  }
}

//
// Expressions
//

class PipeExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly methodName: string;
  readonly argumentExpression: ASTNode | null;

  constructor({ expression, methodName, argumentExpression, location }: PipeExpression) {
    super(location);

    this.expression = expression;
    this.methodName = methodName;
    this.argumentExpression = argumentExpression;
  }
}

class OperatorExpression extends ASTNode {
  readonly operator: '+' | '-' | '*' | '/' | '%';
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class ApplyExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly argumentExpression: ASTNode;

  constructor({ expression, argumentExpression, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argumentExpression = argumentExpression;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { environment, evaluate, bind } = context;

    const arg = await evaluate(this.argumentExpression, environment, bind);

    return argument.invoke((this.expression as Identifier).name, [arg, context]);
  }
};

class RangeExpression extends ASTNode {
  readonly from: ASTNode;
  readonly to: ASTNode;

  constructor({ from, to, location }: RangeExpression) {
    super(location);

    this.from = from;
    this.to = to;
  }
}

class MemberExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly member: string;

  constructor({ expression, member, location }: MemberExpression) {
    super(location);

    this.expression = expression;
    this.member = member;
  }
}

class FunctionExpression extends ASTNode {
  readonly parameterPattern: ASTPatternNode;
  readonly bodyExpression: ASTNode;
  readonly name?: string;

  constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.name = name;
  }
}

class TupleExpression extends ASTNode {
  readonly fieldExpressions: ASTNode[];
  readonly fieldNames: string[];

  constructor({ fieldExpressions, fieldNames, location }: TupleExpression) {
    super(location);

    this.fieldExpressions = fieldExpressions;
    this.fieldNames = fieldNames;
  }
}

//
// Patterns
//

class TuplePattern extends ASTPatternNode {
  readonly patterns: ASTPatternNode[];

  constructor({ patterns, location }: TuplePattern) {
    super(location);

    this.patterns = patterns;
  }

  override async match(value: KopiValue, context: Context) {
    // if (!(value instanceof KopiTuple)) {
    //   throw new Error(`TuplePattern match(): value is not a tuple`);
    // }

    const tuple = value as KopiTuple;
    let bindings = {};

    for (const [index, pattern] of this.patterns.entries()) {
      let matches = await pattern.match(await tuple.fields[index] ?? KopiTuple.empty, context);

      if (matches === undefined) {
        // return undefined;
        throw new Error(`TuplePattern: match() failed.`);
      }

      bindings = { ...bindings, ...matches };
    }

    return bindings;
  }
}

class NumericLiteralPattern extends ASTPatternNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteralPattern) {
    super(location);

    this.value = value;
  }

  override async match(number: KopiValue, context: Context) {
    // TODO: Do we want to throw when testing function predicates?
    // Should we return Error instead?

    if (!(number instanceof KopiNumber && number.value === this.value)) {
      throw new TypeError(`Expected ${this.value} but ${await number.inspect()} found.`);
    }

    return {};
  }
}

class IdentifierPattern extends ASTPatternNode {
  readonly name: string;
  readonly defaultExpression: ASTNode | null;

  constructor({ name, defaultExpression, location }: IdentifierPattern) {
    super(location);

    this.name = name;
    this.defaultExpression = defaultExpression;
  }

  override async match(value: KopiValue, context: Context) {
    const { environment, evaluate, bind } = context;

    if (value === KopiTuple.empty) {
      if (this.defaultExpression !== null) {
        return {
          [this.name]: await evaluate(this.defaultExpression, environment, bind)
        };
      } else {
        throw new TypeError(`Expected a value but ${value} found.`);
      }
    }

    return {
      [this.name]: value
    };
  }
}

//
// Literals
//

class NumericLiteral extends ASTNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }
}

class StringLiteral extends ASTNode {
  readonly value: string;

  constructor({ value, location }: StringLiteral) {
    super(location);

    this.value = value;
  }
}

class ArrayLiteral extends ASTNode {
  readonly elementExpressions: ASTNode[];

  constructor({ elementExpressions, location }: ArrayLiteral) {
    super(location);

    this.elementExpressions = elementExpressions;
  }
}

class AstLiteral extends ASTNode {
  readonly value: ASTNode;

  constructor({ value, location }: AstLiteral) {
    super(location);

    this.value = value;
  }
}

class Identifier extends ASTNode {
  readonly name: string;

  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return argument.invoke(this.name, [KopiTuple.empty, context]);
  }
}

export {
  AssignmentStatement,
  //
  PipeExpression,
  OperatorExpression,
  ApplyExpression,
  RangeExpression,
  MemberExpression,
  FunctionExpression,
  TupleExpression,
  //
  NumericLiteralPattern,
  IdentifierPattern,
  TuplePattern,
  //
  NumericLiteral,
  StringLiteral,
  ArrayLiteral,
  AstLiteral,
  Identifier,
};
