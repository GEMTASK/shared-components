/* eslint-disable no-extend-native */

import * as parser from './lib/parser.js';

import { inspect, RawASTNode, ASTNode, Environment, KopiValue } from './src/types';

import * as astNodes from './src/astnodes';
import * as visitors from './src/visitors';

import { KopiNumber } from './src/classes';

function transform(rawASTNode: RawASTNode): ASTNode {
  switch (rawASTNode.type) {
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
      });
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
      console.warn('No transformAst found for', rawASTNode);

      return new ASTNode(rawASTNode.location);
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

const environment: {
  [name: string]: KopiValue;
} = {
  // async date() {
  //   // return new KopiString(new Date().toLocaleString())
  //   return 100;
  // },
  async sleep(number: KopiNumber) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  }
};

function evaluate(astNode: ASTNode, environment: Environment) {
  if (astNode instanceof astNodes.OperatorExpression) {
    return visitors.OperatorExpression(astNode, environment, evaluate);
  } else if (astNode instanceof astNodes.ApplyExpression) {
    return visitors.ApplyExpression(astNode, environment, evaluate);
  } else if (astNode instanceof astNodes.NumericLiteral) {
    return visitors.NumericLiteral(astNode);
  } else if (astNode instanceof astNodes.Identifier) {
    return visitors.Identifier(astNode, environment);
  } else {
    console.warn('No visitor found for', astNode);

    throw new Error();
  }
}

async function interpret(source: string) {
  var rootAst = parser.parse(source);

  return evaluate(transform(rootAst), environment);
}

export {
  interpret,
  inspect,
};
