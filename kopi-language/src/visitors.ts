import * as astnodes from './astnodes.js';
import { ASTNode, Context, KopiValue } from './types.js';
import {
  KopiArray,
  KopiAstLiteral,
  KopiBoolean,
  KopiDict,
  KopiFunction,
  KopiNumber,
  KopiString,
  KopiTuple,
  KopiRange
} from './classes/index.js';

interface Visitor {
  astNode: ASTNode,
  context: Context;
}

//
// Statements
//

async function Assignment(
  { pattern, expression }: astnodes.Assignment,
  context: Context,
) {
  const { environment, evaluate, bind } = context;

  const expressionValue = await evaluate(expression, environment, bind);
  const patternMatches = await pattern.match(expressionValue, context);

  if (patternMatches) {
    Object.entries(patternMatches).forEach(([name, value]) => {
      if (typeof value === 'function') {
        Object.defineProperty(value, 'name', {
          value: name
        });
      }
    });

    bind(patternMatches);
  }
}

//
// Expressions
//

async function BlockExpression(
  { statements }: astnodes.BlockExpression,
  context: Context,
): Promise<KopiValue> {
  let { environment, evaluate } = context;

  const newEnvironment = {};

  Object.setPrototypeOf(newEnvironment, environment);

  environment = newEnvironment;

  const bind = (bindings: { [name: string]: KopiValue; }) => {
    const newEnvironment = { ...environment, ...bindings };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(environment));

    environment = newEnvironment;
  };

  return statements.reduce<Promise<KopiValue>>(async (result, statement) => (
    (await result, await evaluate(statement, environment, bind))
  ), Promise.resolve(KopiTuple.empty));
}

async function PipeExpression(
  { expression, methodName, argumentExpression }: astnodes.PipeExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const expressionValue = await evaluate(expression, environment, bind);
  const argumentValue = argumentExpression
    ? await evaluate(argumentExpression, environment, bind)
    : KopiTuple.empty;

  return expressionValue.invoke(methodName, [argumentValue, context]);
}

async function OperatorExpression(
  { operator, leftExpression, rightExpression }: astnodes.OperatorExpression,
  context: Context
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment, bind),
    evaluate(rightExpression, environment, bind),
  ]);

  return leftValue.invoke(operator, [rightValue, context]);

  // throw new Error(`"${await leftValue.inspect()}" of type ${leftValue.constructor.name} doesn't have an operator method "${operator}".`);
}

async function ConditionalExpression(
  { expression, consequent, alternate }: astnodes.ConditionalExpression,
  context: Context
) {
  const { evaluate, environment, bind } = context;

  const expressionValue = await evaluate(expression, environment, bind);

  if (expressionValue instanceof KopiBoolean) {
    if ((expressionValue as KopiBoolean).value) {
      return evaluate(consequent, environment, bind);
    }

    return evaluate(alternate, environment, bind);
  }

  throw new TypeError(`Conditional expression must be of type Boolean.`);
}

async function LogicalOrExpression(
  { leftExpression, rightExpression }: astnodes.LogicalOrExpression,
  context: Context
) {
  const { environment, evaluate, bind } = context;

  const leftValue = await evaluate(leftExpression, environment, bind);

  if ((leftValue as KopiBoolean).value) {
    return KopiBoolean.true;
  }

  const rightValue = await evaluate(rightExpression, environment, bind);

  if ((rightValue as KopiBoolean).value) {
    return KopiBoolean.true;
  }

  return KopiBoolean.false;
}

async function LogicalAndExpression(
  { leftExpression, rightExpression }: astnodes.LogicalAndExpression,
  context: Context
) {
  const { environment, evaluate, bind } = context;

  const leftValue = await evaluate(leftExpression, environment, bind);

  if ((leftValue as KopiBoolean).value) {
    const rightValue = await evaluate(rightExpression, environment, bind);

    if ((rightValue as KopiBoolean).value) {
      return KopiBoolean.true;
    }
  }

  return KopiBoolean.false;
}

async function ApplyExpression(
  { expression, argumentExpression }: astnodes.ApplyExpression,
  context: Context
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const func = await evaluate(expression, environment, bind);

  if ('apply' in func && typeof func.apply === 'function') {
    return func.apply(undefined, [
      await evaluate(argumentExpression, environment, bind),
      context
    ]);
  }

  throw new Error(`No KopiApplicative.apply() method found for ${func.constructor.name}.`);
}

async function RangeExpression(
  { from, to }: astnodes.RangeExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return new KopiRange(
    evaluate(from, environment, bind),
    evaluate(to, environment, bind)
  );
}

async function MemberExpression(
  { expression, member }: astnodes.MemberExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const expressionValue = await evaluate(expression, environment, bind);

  if (expressionValue.hasOwnProperty(member)) {
    const value = await (expressionValue as any)[member];

    if (value !== undefined) {
      return value;
    }
  }

  throw new ReferenceError(`${await expressionValue.inspect()} doesn't have a member "${member}".`);
}

async function UnaryExpression(
  { operator, argumentExpression }: astnodes.UnaryExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const argumentValue = await evaluate(argumentExpression, environment, bind);

  return argumentValue.invoke(operator, [argumentValue, context]);
}

async function FunctionExpression(
  { parameterPattern, predicateExpression, bodyExpression, name }: astnodes.FunctionExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment } = context;

  return new KopiFunction(
    parameterPattern,
    predicateExpression,
    bodyExpression,
    environment,
    name,
  );
}

async function TupleExpression(
  { fieldExpressions, fieldNames }: astnodes.TupleExpression,
  context: Context
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return new KopiTuple(
    fieldExpressions.map(expressionField => evaluate(expressionField, environment, bind)),
    fieldNames
  );
}

//
// Literals
//

async function ArrayLiteral(
  { elementExpressions }: astnodes.ArrayLiteral,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return new KopiArray(
    elementExpressions.map((expression) => evaluate(expression, environment, bind))
  );
}

async function DictLiteral(
  { entryExpressions }: astnodes.DictLiteral,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return KopiDict.fromIterable(
    new KopiArray(
      entryExpressions.map(([key, expression]) => new KopiTuple([
        evaluate(key, environment, bind),
        evaluate(expression, environment, bind)
      ]))
    ) as AsyncIterable<KopiTuple>
  );
}

async function AstLiteral(
  { value }: astnodes.AstLiteral
): Promise<KopiValue> {
  return new KopiAstLiteral(value);
}

async function Identifier(
  { name }: astnodes.Identifier,
  context: Context,
): Promise<KopiValue> {
  const { environment } = context;

  const value = environment[name];

  if (name in environment) {
    return value;
  }

  throw new ReferenceError(`Variable "${name}" not found in current scope.`);
}

export {
  type Visitor,
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
  ArrayLiteral,
  DictLiteral,
  AstLiteral,
  Identifier,
};
