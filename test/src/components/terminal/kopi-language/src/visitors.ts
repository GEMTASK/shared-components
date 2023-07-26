import * as astNodes from './astnodes';
import { ASTNode, Context, KopiValue } from './types';
import { KopiAstLiteral, KopiFunction, KopiNumber, KopiTuple } from './classes';

interface Visitor {
  astNode: ASTNode,
  context: Context;
}

//
// Expressions
//

async function OperatorExpression(
  astNode: astNodes.OperatorExpression,
  context: Context
): Promise<KopiValue> {
  const { operator, leftExpression, rightExpression } = astNode;
  const { environment, evaluate } = context;

  const [leftValue, rightValue] = await Promise.all([
    evaluate(leftExpression, environment),
    evaluate(rightExpression, environment),
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
  const { environment, evaluate } = context;

  const func = await evaluate(expression, environment);

  if ('apply' in func && typeof func.apply === 'function') {
    return func.apply(undefined, [
      await evaluate(argumentExpression, environment),
      context
    ]);
  }

  throw new Error(`No KopiApplicative.apply() method found for ${func.constructor.name}.`);
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
  const { environment, evaluate } = context;

  return new KopiTuple(
    fieldExpressions.map(expressionField => evaluate(expressionField, environment)),
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

async function AstLiteral(
  { value }: astNodes.AstLiteral
): Promise<KopiValue> {
  return new KopiAstLiteral(value);
}

async function Identifier(
  astNode: astNodes.Identifier,
  context: Context,
): Promise<KopiValue> {
  const { environment, evaluate } = context;

  const value = environment[astNode.name];

  if (astNode.name in environment) {
    return value;
  }

  throw new Error(`Variable "${astNode.name}" not found in current scope.`);
}

export {
  type Visitor,
  OperatorExpression,
  ApplyExpression,
  FunctionExpression,
  TupleExpression,
  //
  NumericLiteral,
  AstLiteral,
  Identifier,
};
