import { KopiNumber, KopiTuple } from './classes';
import { ASTNode, ASTPatternNode, Context, KopiValue } from './types';

//
// Expressions
//

class OperatorExpression extends ASTNode {
  readonly operator: '+' | '-';
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
};

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
      throw new Error(`NumericLiteralPattern: match() failed. Expected "${this.value}" but found "${await number.inspect()}".`);
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
    const { environment, evaluate } = context;

    if (value === KopiTuple.empty) {
      if (this.defaultExpression !== null) {
        return {
          [this.name]: await evaluate(this.defaultExpression, environment)
        };
      } else {
        throw new Error(`IdentifierPattern: match() failed. Expected a value but found "${value}"`);
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

class Identifier extends ASTNode {
  readonly name: string;

  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }
}

export {
  OperatorExpression,
  FunctionExpression,
  ApplyExpression,
  TupleExpression,
  //
  NumericLiteralPattern,
  IdentifierPattern,
  TuplePattern,
  //
  NumericLiteral,
  Identifier,
};
