import * as astNodes from './astnodes';
import { Environment, Evaluate, KopiValue } from './types';
import { KopiNumber } from './classes';

async function OperatorExpression(
  astNode: astNodes.OperatorExpression,
  environment: Environment,
  evaluate: Evaluate,
): Promise<KopiValue> {
  const { operator, leftExpression, rightExpression } = astNode;

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
  environment: Environment,
  evaluate: Evaluate,
): Promise<KopiValue> {
  const func = await evaluate(expression, environment);

  if ('apply' in func && typeof func.apply === 'function') {
    return func.apply(undefined, [await evaluate(argumentExpression, environment)]);
  }

  throw new Error(`No KopiApplicative.apply() method found for ${func.constructor.name}.`);
}

async function FunctionExpression(
  { parameterPattern, bodyExpression, name }: astNodes.FunctionExpression,
  environment: Environment,
): Promise<KopiValue> {
  return new KopiNumber(5);
  // return new KopiFunction(
  //   parameterPattern,
  //   bodyExpression,
  //   environment,
  //   name,
  // );
}

async function NumericLiteral(
  { value }: astNodes.NumericLiteral,
): Promise<KopiValue> {
  return new KopiNumber(value);
}

async function Identifier(
  astNode: astNodes.Identifier,
  environment: Environment,
): Promise<KopiValue> {
  const value = environment[astNode.name];

  if (astNode.name in environment) {
    return value;
  }

  throw new Error(`Variable "${astNode.name}" not found in current scope.`);
}

export {
  OperatorExpression,
  ApplyExpression,
  FunctionExpression,
  NumericLiteral,
  Identifier,
};
