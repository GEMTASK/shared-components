import * as parser from './lib/parser.js';

import * as astnodes from './src/astnodes.js';

interface RawASTNode {
  [key: string]: any;
}

class ASTNode {
  location: {} = {};

  constructor(location: {}) {
    this.location = location;
  }
}

//

function transform(rawASTNode: RawASTNode): ASTNode {
  switch (rawASTNode.type) {
    case 'OperatorExpression':
      return new astnodes.OperatorExpression({
        operator: rawASTNode.operator,
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      });
    case 'FunctionExpression':
      return new astnodes.FunctionExpression({
        parameterPattern: transform(rawASTNode.parameterPattern),
        bodyExpression: transform(rawASTNode.bodyExpression),
        location: rawASTNode.location,
      });
    case 'NumericLiteral':
      return new astnodes.NumericLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      });
    default:
      console.warn(`No transformAst found for '${JSON.stringify(rawASTNode)}'`);

      return new ASTNode(rawASTNode.location);
  }

  // throw new Error(`No transformAst found for '${JSON.stringify(rawASTNode)}'`);
}

async function interpret(source: string) {
  var rootAst = parser.parse(source);

  return transform(rootAst);
}

export {
  interpret,
};
