/* eslint-disable no-extend-native */

import * as parser from './lib/parser.js';

import { RawASTNode, ASTNode, ASTPatternNode, Environment } from './src/types';

import * as astNodes from './src/astnodes';
import * as visitors from './src/visitors';

import { inspect } from './src/utils';

function transform(rawASTNode: RawASTNode): ASTNode {
  switch (rawASTNode.type) {
    case 'TupleExpression':
      return new astNodes.TupleExpression({
        fieldExpressions: rawASTNode.fieldExpressions.map((expression: ASTNode) => transform(expression)),
        fieldNames: rawASTNode.fieldNames,
        location: rawASTNode.location,
      });
    case 'OperatorExpression':
      return new astNodes.OperatorExpression({
        operator: rawASTNode.operator,
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      });
    case 'ApplyExpression':
      return new astNodes.ApplyExpression({
        expression: transform(rawASTNode.expression),
        argumentExpression: transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      });
    case 'FunctionExpression':
      return new astNodes.FunctionExpression({
        parameterPattern: transform(rawASTNode.parameterPattern),
        bodyExpression: transform(rawASTNode.bodyExpression),
        location: rawASTNode.location,
      } as astNodes.FunctionExpression);
    case 'TuplePattern':
      return new astNodes.TuplePattern({
        patterns: rawASTNode.fieldPatterns.map((pattern: ASTPatternNode) => transform(pattern)),
        location: rawASTNode.location,
      } as astNodes.TuplePattern);
    case 'NumericLiteral':
      return new astNodes.NumericLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      });
    case 'Identifier':
      return new astNodes.Identifier({
        name: rawASTNode.name,
        location: rawASTNode.location,
      });
    default:
      console.warn('No transform found for', rawASTNode);

      throw new Error(`No transform found for ${rawASTNode.type}`);
  }
}

declare global {
  interface FunctionConstructor {
    // traits: KopiTrait[];
  }

  interface Function {
    inspect(): Promise<string>;
  }
}

Function.prototype.inspect = function () {
  return Promise.resolve(`<native-function>`);
};

// const visitorMap = {
//   OperatorExpression: { astNode: astNodes.OperatorExpression, visitor: visitors.OperatorExpression },
//   ApplyExpression: { astNode: astNodes.ApplyExpression, visitor: visitors.ApplyExpression },
// } as const;

function evaluate(astNode: ASTNode, environment: Environment) {
  // const foo = visitorMap[astNode.constructor.name as keyof typeof visitorMap];

  const context = { environment, evaluate };

  if (astNode instanceof astNodes.OperatorExpression) {
    return visitors.OperatorExpression(astNode, context);
  } else if (astNode instanceof astNodes.ApplyExpression) {
    return visitors.ApplyExpression(astNode, context);
  } else if (astNode instanceof astNodes.FunctionExpression) {
    return visitors.FunctionExpression(astNode, context);
  } else if (astNode instanceof astNodes.TupleExpression) {
    return visitors.TupleExpression(astNode, context);
  } else if (astNode instanceof astNodes.NumericLiteral) {
    return visitors.NumericLiteral(astNode);
  } else if (astNode instanceof astNodes.Identifier) {
    return visitors.Identifier(astNode, context);
  } else {
    console.warn('No visitor found for', astNode);

    throw new Error(`No visitor found for ${astNode.constructor.name}`);
  }
}

async function interpret(source: string, environment: Environment) {
  var rootAst = parser.parse(source);

  return evaluate(transform(rootAst), environment);
}

export {
  interpret,
  inspect,
};
