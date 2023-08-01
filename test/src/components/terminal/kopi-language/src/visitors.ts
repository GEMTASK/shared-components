import * as astNodes from './astnodes';
import { ASTNode, Context, KopiValue } from './types';
import { KopiArray, KopiAstLiteral, KopiFunction, KopiNumber, KopiString, KopiTuple } from './classes';
import KopiRange from './classes/KopiRange';

interface Visitor {
  astNode: ASTNode,
  context: Context;
}

//
// Statements
//

async function AssignmentStatement(
  { pattern, expression }: astNodes.AssignmentStatement,
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

  if (leftValue instanceof KopiNumber) {
    return leftValue[operator](rightValue);
  }

  throw new Error(`"${await leftValue.inspect()}" of type ${leftValue.constructor.name} doesn't have an operator method "${operator}".`);
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
  const value = await (expressionValue as any)[member];

  if (value !== undefined) {
    return value;
  }

  throw new Error(`${await expression.inspect()} doesn't have a member '${member}'`);
}

async function FunctionExpression(
  { parameterPattern, bodyExpression, name }: astNodes.FunctionExpression,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate } = context;

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
  );
}

//
// Literals
//

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
  NumericLiteral,
  StringLiteral,
  ArrayLiteral,
  AstLiteral,
  Identifier,
};
