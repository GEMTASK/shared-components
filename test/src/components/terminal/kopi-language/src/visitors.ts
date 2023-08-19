import * as astNodes from './astnodes';
import { ASTNode, Context, KopiValue } from './types';
import { KopiArray, KopiAstLiteral, KopiBoolean, KopiFunction, KopiNumber, KopiString, KopiTuple } from './classes';
import KopiRange from './classes/KopiRange';

interface Visitor {
  astNode: ASTNode,
  context: Context;
}

//
// Statements
//

async function Assignment(
  { pattern, expression }: astNodes.Assignment,
  context: Context,
) {
  const { environment, evaluate, bind } = context;

  const expressionValue = await evaluate(expression, environment, bind);
  const patternMatches = await pattern.match(expressionValue, context);

  if (patternMatches) {
    bind(patternMatches);
  }
}

//
// Expressions
//

async function BlockExpression(
  { statements }: astNodes.BlockExpression,
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
  { expression, methodName, argumentExpression }: astNodes.PipeExpression,
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
  astNode: astNodes.OperatorExpression,
  context: Context
): Promise<KopiValue> {
  const { operator, leftExpression, rightExpression } = astNode;
  const { environment, evaluate, bind } = context;

  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment, bind),
    evaluate(rightExpression, environment, bind),
  ]);

  if (operator in leftValue) {
    return (leftValue as any)[operator](rightValue);
  }

  throw new Error(`"${await leftValue.inspect()}" of type ${leftValue.constructor.name} doesn't have an operator method "${operator}".`);
}

async function ConditionalExpression(
  { expression, consequent, alternate }: astNodes.ConditionalExpression,
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

  throw new TypeError(`Conditional expression but be of type Boolean.`);
}

async function ApplyExpression(
  { expression, argumentExpression }: astNodes.ApplyExpression,
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
  { from, to }: astNodes.RangeExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return new KopiRange(
    evaluate(from, environment, bind),
    evaluate(to, environment, bind)
  );
}

async function MemberExpression(
  { expression, member }: astNodes.MemberExpression,
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

  throw new Error(`${await expressionValue.inspect()} doesn't have a member '${member}'`);
}

async function UnaryExpression(
  { operator, argumentExpression }: astNodes.UnaryExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  const argumentValue = await evaluate(argumentExpression, environment, bind);

  return argumentValue.invoke(operator, [argumentValue, context]);
}

async function FunctionExpression(
  { parameterPattern, bodyExpression, name }: astNodes.FunctionExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment } = context;

  return new KopiFunction(
    parameterPattern,
    bodyExpression,
    environment,
    name,
  );
}

async function TupleExpression(
  { fieldExpressions, fieldNames }: astNodes.TupleExpression,
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

async function BooleanLiteral(
  { value }: astNodes.BooleanLiteral
): Promise<KopiValue> {
  return new KopiBoolean(value);
}

async function NumericLiteral(
  { value }: astNodes.NumericLiteral
): Promise<KopiValue> {
  return new KopiNumber(value);
}

async function StringLiteral(
  { value }: astNodes.StringLiteral,
): Promise<KopiValue> {
  return new KopiString(value);
}

async function ArrayLiteral(
  { elementExpressions }: astNodes.ArrayLiteral,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate, bind } = context;

  return new KopiArray(
    elementExpressions.map((expression) => evaluate(expression, environment, bind))
  );
}

async function AstLiteral(
  { value }: astNodes.AstLiteral
): Promise<KopiValue> {
  return new KopiAstLiteral(value);
}

async function Identifier(
  astNode: astNodes.Identifier,
  context: Context,
): Promise<KopiValue> {
  const { environment } = context;

  const value = environment[astNode.name];

  if (astNode.name in environment) {
    return value;
  }

  throw new ReferenceError(`Variable "${astNode.name}" not found in current scope.`);
}

export {
  type Visitor,
  Assignment,
  //
  BlockExpression,
  PipeExpression,
  OperatorExpression,
  ConditionalExpression,
  ApplyExpression,
  RangeExpression,
  MemberExpression,
  UnaryExpression,
  FunctionExpression,
  TupleExpression,
  //
  BooleanLiteral,
  NumericLiteral,
  StringLiteral,
  ArrayLiteral,
  AstLiteral,
  Identifier,
};
