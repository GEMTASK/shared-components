import { KopiArray, KopiBoolean, KopiString, KopiTuple } from './classes/index.js';
import { ASTNode, ASTPatternNode, Context, KopiValue } from './types.js';

//
// Statements
//

class Assignment extends ASTNode {
  readonly pattern: ASTPatternNode;
  readonly expression: ASTNode;

  constructor({ pattern, expression, location }: Assignment) {
    super(location);

    this.pattern = pattern;
    this.expression = expression;
  }
}

//
// Expressions
//

class BlockExpression extends ASTNode {
  readonly statements: ASTNode[];

  constructor({ statements, location }: BlockExpression) {
    super(location);

    this.statements = statements;
  }
}

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
  readonly operator: string;
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class ConditionalExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly consequent: ASTNode;
  readonly alternate: ASTNode;

  constructor({ expression, consequent, alternate, location }: ConditionalExpression) {
    super(location);

    this.expression = expression;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

class LogicalOrExpression extends ASTNode {
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ leftExpression, rightExpression, location }: LogicalAndExpression) {
    super(location);

    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class LogicalAndExpression extends ASTNode {
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ leftExpression, rightExpression, location }: LogicalAndExpression) {
    super(location);

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

  async inspect() {
    return `'(${(await this.expression as Identifier).name} ${await this.argumentExpression.inspect()})`;
  }

  async apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue> {
    const { environment, evaluate, bind } = context;

    const arg = await evaluate(this.argumentExpression, environment, bind);

    return argument.invoke(argument, (this.expression as Identifier).name, [arg, context]);
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

class UnaryExpression extends ASTNode {
  readonly operator: string;
  readonly argumentExpression: ASTNode;

  constructor({ operator, argumentExpression, location }: UnaryExpression) {
    super(location);

    this.operator = operator;
    this.argumentExpression = argumentExpression;
  }
}

class FunctionExpression extends ASTNode {
  readonly parameterPattern: ASTPatternNode;
  readonly predicateExpression: ASTNode;
  readonly bodyExpression: ASTNode;
  readonly name?: string;

  constructor({ parameterPattern, predicateExpression, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.predicateExpression = predicateExpression;
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
  readonly fieldPatterns: ASTPatternNode[];
  readonly fieldNames: string[];
  readonly defaultExpression: ASTNode | null;

  constructor({ fieldPatterns, fieldNames, defaultExpression, location }: TuplePattern) {
    super(location);

    this.fieldPatterns = fieldPatterns;
    this.fieldNames = fieldNames;
    this.defaultExpression = defaultExpression;
  }

  async test(value: KopiValue, context: Context) {
    const tuple = value as KopiTuple;

    for (const [index, pattern] of this.fieldPatterns.entries()) {
      if (!await pattern.test(await tuple.fields[index] ?? KopiTuple.empty, context)) {
        return false;
      }
    }

    return true;
  }

  override async match(value: KopiValue, context: Context) {
    const { evaluate, environment, bind } = context;

    if (this.defaultExpression) {
      if (value === KopiTuple.empty) {
        value = await evaluate(this.defaultExpression, environment, bind);
      } else {
        throw new TypeError(`Match expected a value but ${value} found.`);
      }
    }

    const tuple = value as KopiTuple;

    let bindings = {};

    for (const [index, pattern] of this.fieldPatterns.entries()) {
      let matches;

      if (this.fieldNames[index]) {
        const fieldIndex = tuple._fieldNames.indexOf(this.fieldNames[index]);

        if (fieldIndex >= 0) {
          matches = await pattern.match(await tuple.fields[fieldIndex] ?? KopiTuple.empty, context);
        }
      } else {
        matches = await pattern.match(await tuple.fields[index] ?? KopiTuple.empty, context);
      }

      if (matches === undefined) {
        throw new Error(`TuplePattern: match() failed.`);
      }

      bindings = { ...bindings, ...matches };
    }

    return bindings;
  }
}

// TODO: Should capture and use type, not name

class ConstructorPattern extends ASTPatternNode {
  readonly name: string;
  readonly argumentPattern: ASTPatternNode;

  constructor({ name, argumentPattern, location }: ConstructorPattern) {
    super(location);

    this.name = name;
    this.argumentPattern = argumentPattern;
  }

  async test(value: KopiValue, context: Context) {
    const { environment } = context;

    if (
      typeof value === 'number' && this.name === 'Number'
      || value instanceof (environment as any)[this.name]
    ) {
      return true;
    }

    return false;
  }

  // TODO
  async match(value: KopiValue, context: Context) {
    const { environment } = context;

    if (
      typeof value === 'number' && this.name === 'Number'
      || value instanceof (environment as any)[this.name]
    ) {
      return this.argumentPattern.match(value, context);
    }

    throw new TypeError(`Match expected a ${this.name} but ${await value.constructor.inspect()} found.`);
  }
}

class NumericLiteralPattern extends ASTPatternNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteralPattern) {
    super(location);

    this.value = value;
  }

  async test(number: KopiValue, context: Context) {
    if (!(typeof number === 'number' && number === this.value)) {
      return false;
    }

    return true;
  }

  override async match(number: KopiValue, context: Context) {
    if (!(typeof number === 'number' && number === this.value)) {
      throw new TypeError(`Match expected ${this.value} but ${await number.inspect()} found.`);
    }

    return {};
  }
}

class StringLiteralPattern extends ASTPatternNode {
  readonly value: string;

  constructor({ value, location }: StringLiteralPattern) {
    super(location);

    this.value = value;
  }

  async test(value: KopiValue, context: Context) {
    if (!(value instanceof KopiString && value.value === this.value)) {
      return false;
    }

    return true;
  }

  override async match(value: KopiValue, context: Context) {
    if (!(value instanceof KopiString && value.value === this.value)) {
      throw new TypeError(`Match expected "${this.value}" but ${await value.inspect()} found.`);
    }

    return {};
  }
}

class BooleanLiteralPattern extends ASTPatternNode {
  readonly value: boolean;

  constructor({ value, location }: BooleanLiteralPattern) {
    super(location);

    this.value = value;
  }

  async test(value: KopiValue, context: Context) {
    if (!(value instanceof KopiBoolean && value.value === this.value)) {
      return false;
    }

    return true;
  }

  override async match(value: KopiValue, context: Context) {
    if (!(value instanceof KopiBoolean && value.value === this.value)) {
      throw new TypeError(`Match expected ${this.value} but ${await value.inspect()} found.`);
    }

    return {};
  }
}

class ArrayLiteralPattern extends ASTPatternNode {
  readonly elementPatterns: ASTPatternNode[];
  readonly initPattern: ASTPatternNode;
  readonly restPattern: ASTPatternNode;
  readonly defaultExpression: ASTNode | null;

  constructor({ elementPatterns, initPattern, restPattern, defaultExpression, location }: ArrayLiteralPattern) {
    super(location);

    this.elementPatterns = elementPatterns;
    this.initPattern = initPattern;
    this.restPattern = restPattern;
    this.defaultExpression = defaultExpression;
  }

  async test(value: KopiValue, context: Context) {
    const array = value as KopiArray;
    let index = 0;

    for await (const value of array) {
      if (!await this.elementPatterns[index++].test(value ?? KopiTuple.empty, context)) {
        return false;
      }
    }

    return true;
  }

  override async match(value: KopiValue, context: Context) {
    const { evaluate, environment, bind } = context;

    if (value === KopiTuple.empty) {
      if (this.defaultExpression) {
        value = await evaluate(this.defaultExpression, environment, bind);
      } else {
        throw new TypeError(`Match expected a value but ${value} found.`);
      }
    }

    let array = value as KopiArray;

    let bindings = {};
    let index = 0;
    let init = [];
    let rest = [];

    for await (const value of array) {
      if (this.restPattern && index > this.elementPatterns.length - 1) {
        rest.push(value);
      } else {
        let matches = await this.elementPatterns[index].match(value ?? KopiTuple.empty, context);

        if (matches === undefined) {
          throw new Error(`ArrayPattern: match() failed.`);
        }

        bindings = { ...bindings, ...matches };

        if (!this.restPattern && index === this.elementPatterns.length - 1) {
          break;
        }
      }

      index += 1;
    }

    if (this.restPattern) {
      let matches = await this.restPattern.match(new KopiArray(rest), context);

      bindings = { ...bindings, ...matches };
    }

    return bindings;
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

  async test(value: KopiValue, context: Context) {
    if (value === KopiTuple.empty) {
      if (this.defaultExpression) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  override async match(value: KopiValue, context: Context) {
    const { environment, evaluate, bind } = context;

    if (value === KopiTuple.empty) {
      if (this.defaultExpression) {
        return {
          [this.name]: await evaluate(this.defaultExpression, environment, bind)
        };
      } else {
        // throw new TypeError(`Identifier match: Expected a value but ${await value.inspect()} found.`);
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

class BooleanLiteral extends ASTNode {
  readonly value: KopiBoolean;

  constructor({ value, location }: BooleanLiteral) {
    super(location);

    this.value = value;
  }

  async inspect() {
    return `${this.value.value ? 'true' : 'false'}`;
  }
}

class NumericLiteral extends ASTNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }

  async inspect() {
    return `${this.value}`;
  }
}

class StringLiteral extends ASTNode {
  readonly value: KopiString;

  constructor({ value, location }: StringLiteral) {
    super(location);

    this.value = value;
  }

  async inspect() {
    return `"${this.value.value}"`;
  }
}

class ArrayLiteral extends ASTNode {
  readonly elementExpressions: ASTNode[];

  constructor({ elementExpressions, location }: ArrayLiteral) {
    super(location);

    this.elementExpressions = elementExpressions;
  }
}

class DictLiteral extends ASTNode {
  readonly entryExpressions: [ASTNode, ASTNode][];

  constructor({ entryExpressions, location }: DictLiteral) {
    super(location);

    this.entryExpressions = entryExpressions;
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

  async apply(thisArg: KopiValue, [argument, context]: [KopiValue, Context]): Promise<KopiValue> {
    return argument.invoke(argument, this.name, [KopiTuple.empty, context]);
  }

  '=='(that: Identifier) {
    return new KopiBoolean(this.name === that.name);
  }

  async inspect() {
    return `'${this.name}`;
  }
}

export {
  Assignment,
  //
  BlockExpression,
  PipeExpression,
  OperatorExpression,
  ConditionalExpression,
  LogicalOrExpression,
  LogicalAndExpression,
  ApplyExpression,
  RangeExpression,
  MemberExpression,
  UnaryExpression,
  FunctionExpression,
  TupleExpression,
  //
  TuplePattern,
  ConstructorPattern,
  NumericLiteralPattern,
  StringLiteralPattern,
  BooleanLiteralPattern,
  ArrayLiteralPattern,
  IdentifierPattern,
  //
  BooleanLiteral,
  NumericLiteral,
  StringLiteral,
  ArrayLiteral,
  DictLiteral,
  AstLiteral,
  Identifier,
};
