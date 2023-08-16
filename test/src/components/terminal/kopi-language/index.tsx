import * as parser from './lib/parser.js';

import { RawASTNode, ASTNode, ASTPatternNode, Environment, Bind } from './src/types';

import * as astNodes from './src/astnodes';
import * as visitors from './src/visitors';

import { inspect } from './src/utils';

function transform(rawASTNode: RawASTNode): ASTNode {
  switch (rawASTNode.type) {
    case 'Assignment':
      return new astNodes.Assignment({
        pattern: transform(rawASTNode.pattern),
        expression: transform(rawASTNode.expression),
      } as astNodes.Assignment);
    //
    case 'BlockExpression':
      return new astNodes.BlockExpression({
        statements: rawASTNode.statements.map((statement: ASTNode) => transform(statement)),
      } as astNodes.BlockExpression);
    case 'PipeExpression':
      return new astNodes.PipeExpression({
        expression: transform(rawASTNode.expression),
        methodName: rawASTNode.methodName,
        argumentExpression: rawASTNode.argumentExpression && transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      } as astNodes.PipeExpression);
    case 'TupleExpression':
      return new astNodes.TupleExpression({
        fieldExpressions: rawASTNode.fieldExpressions.map((expression: ASTNode) => transform(expression)),
        fieldNames: rawASTNode.fieldNames,
        location: rawASTNode.location,
      } as astNodes.TupleExpression);
    case 'OperatorExpression':
      return new astNodes.OperatorExpression({
        operator: rawASTNode.operator,
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      } as astNodes.OperatorExpression);
    case 'ApplyExpression':
      return new astNodes.ApplyExpression({
        expression: transform(rawASTNode.expression),
        argumentExpression: transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      } as astNodes.ApplyExpression);
    case 'RangeExpression':
      return new astNodes.RangeExpression({
        from: transform(rawASTNode.from),
        to: transform(rawASTNode.to),
        location: rawASTNode.location,
      } as astNodes.RangeExpression);
    case 'MemberExpression':
      return new astNodes.MemberExpression({
        expression: transform(rawASTNode.expression),
        member: rawASTNode.member,
        location: rawASTNode.location,
      } as astNodes.MemberExpression);
    case 'FunctionExpression':
      return new astNodes.FunctionExpression({
        parameterPattern: transform(rawASTNode.parameterPattern),
        bodyExpression: transform(rawASTNode.bodyExpression),
        name: rawASTNode.name,
        location: rawASTNode.location,
      } as astNodes.FunctionExpression);
    //
    case 'TuplePattern':
      return new astNodes.TuplePattern({
        patterns: rawASTNode.fieldPatterns.map((pattern: ASTPatternNode) => transform(pattern)),
        location: rawASTNode.location,
      } as astNodes.TuplePattern);
    case 'NumericLiteralPattern':
      return new astNodes.NumericLiteralPattern({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astNodes.NumericLiteralPattern);
    case 'ArrayLiteralPattern':
      return new astNodes.ArrayLiteralPattern({
        elementPatterns: rawASTNode.elementPatterns.map((pattern: ASTPatternNode) => transform(pattern)),
        location: rawASTNode.location,
      } as astNodes.ArrayLiteralPattern);
    case 'IdentifierPattern':
      return new astNodes.IdentifierPattern({
        name: rawASTNode.name,
        location: rawASTNode.location,
        defaultExpression: rawASTNode.defaultExpression && transform(rawASTNode.defaultExpression),
      } as astNodes.IdentifierPattern);
    //
    case 'NumericLiteral':
      return new astNodes.NumericLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astNodes.NumericLiteral);
    case 'StringLiteral':
      return new astNodes.StringLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astNodes.StringLiteral);
    case 'ArrayLiteral':
      return new astNodes.ArrayLiteral({
        elementExpressions: rawASTNode.elementExpressions.map((expression: ASTNode) => transform(expression)),
        location: rawASTNode.location,
      } as astNodes.ArrayLiteral);
    case 'AstLiteral':
      return new astNodes.AstLiteral({
        value: transform(rawASTNode.value),
        location: rawASTNode.location,
      } as astNodes.AstLiteral);
    case 'Identifier':
      return new astNodes.Identifier({
        name: rawASTNode.name,
        location: rawASTNode.location,
      } as astNodes.Identifier);
    default:
      console.warn('No transform found for', rawASTNode);

      throw new Error(`No transform found for ${rawASTNode.type}.`);
  }
}

// const visitorMap = {
//   OperatorExpression: { astNode: astNodes.OperatorExpression, visitor: visitors.OperatorExpression },
//   ApplyExpression: { astNode: astNodes.ApplyExpression, visitor: visitors.ApplyExpression },
// } as const;

function evaluate(astNode: ASTNode, environment: Environment, bind: Bind) {
  // const foo = visitorMap[astNode.constructor.name as keyof typeof visitorMap];

  const context = { environment, evaluate, bind };

  if (astNode instanceof astNodes.Assignment) {
    return visitors.Assignment(astNode, context);
  } else if (astNode instanceof astNodes.BlockExpression) {
    return visitors.BlockExpression(astNode, context);
  } else if (astNode instanceof astNodes.PipeExpression) {
    return visitors.PipeExpression(astNode, context);
  } else if (astNode instanceof astNodes.OperatorExpression) {
    return visitors.OperatorExpression(astNode, context);
  } else if (astNode instanceof astNodes.ApplyExpression) {
    return visitors.ApplyExpression(astNode, context);
  } else if (astNode instanceof astNodes.RangeExpression) {
    return visitors.RangeExpression(astNode, context);
  } else if (astNode instanceof astNodes.MemberExpression) {
    return visitors.MemberExpression(astNode, context);
  } else if (astNode instanceof astNodes.FunctionExpression) {
    return visitors.FunctionExpression(astNode, context);
  } else if (astNode instanceof astNodes.TupleExpression) {
    return visitors.TupleExpression(astNode, context);
  } else if (astNode instanceof astNodes.NumericLiteral) {
    return visitors.NumericLiteral(astNode);
  } else if (astNode instanceof astNodes.StringLiteral) {
    return visitors.StringLiteral(astNode);
  } else if (astNode instanceof astNodes.ArrayLiteral) {
    return visitors.ArrayLiteral(astNode, context);
  } else if (astNode instanceof astNodes.AstLiteral) {
    return astNode.value;
  } else if (astNode instanceof astNodes.Identifier) {
    return visitors.Identifier(astNode, context);
  } else {
    console.warn('No visitor found for', astNode);

    throw new Error(`No visitor found for ${astNode.constructor.name}.`);
  }
}

async function interpret(source: string, environment: Environment, bind: Bind) {
  var rootAst = parser.parse(source);

  if (rootAst) {
    return evaluate(transform(rootAst), environment, bind);
  }
}

export {
  evaluate,
  interpret,
  inspect,
};
