import * as parser from './lib/parser.mjs';

import { RawASTNode, ASTNode, ASTPatternNode, Environment, Bind } from './src/types';

import * as astnodes from './src/astnodes';
import * as visitors from './src/visitors';

import { inspect } from './src/utils';

function transform(rawASTNode: RawASTNode): ASTNode {
  switch (rawASTNode.type) {
    case 'Assignment':
      return new astnodes.Assignment({
        pattern: transform(rawASTNode.pattern),
        expression: transform(rawASTNode.expression),
      } as astnodes.Assignment);
    //
    case 'BlockExpression':
      return new astnodes.BlockExpression({
        statements: rawASTNode.statements.map((statement: ASTNode) => transform(statement)),
      } as astnodes.BlockExpression);
    case 'PipeExpression':
      return new astnodes.PipeExpression({
        expression: transform(rawASTNode.expression),
        methodName: rawASTNode.methodName,
        argumentExpression: rawASTNode.argumentExpression && transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      } as astnodes.PipeExpression);
    case 'TupleExpression':
      return new astnodes.TupleExpression({
        fieldExpressions: rawASTNode.fieldExpressions.map((expression: ASTNode) => transform(expression)),
        fieldNames: rawASTNode.fieldNames,
        location: rawASTNode.location,
      } as astnodes.TupleExpression);
    case 'OperatorExpression':
      return new astnodes.OperatorExpression({
        operator: rawASTNode.operator,
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      } as astnodes.OperatorExpression);
    case 'ConditionalExpression':
      return new astnodes.ConditionalExpression({
        expression: transform(rawASTNode.expression),
        consequent: transform(rawASTNode.consequent),
        alternate: transform(rawASTNode.alternate)
      } as astnodes.ConditionalExpression);
    case 'LogicalOrExpression':
      return new astnodes.LogicalOrExpression({
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      } as astnodes.LogicalOrExpression);
    case 'LogicalAndExpression':
      return new astnodes.LogicalAndExpression({
        leftExpression: transform(rawASTNode.leftExpression),
        rightExpression: transform(rawASTNode.rightExpression),
        location: rawASTNode.location,
      } as astnodes.LogicalAndExpression);
    case 'ApplyExpression':
      return new astnodes.ApplyExpression({
        expression: transform(rawASTNode.expression),
        argumentExpression: transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      } as astnodes.ApplyExpression);
    case 'RangeExpression':
      return new astnodes.RangeExpression({
        from: transform(rawASTNode.from),
        to: transform(rawASTNode.to),
        location: rawASTNode.location,
      } as astnodes.RangeExpression);
    case 'MemberExpression':
      return new astnodes.MemberExpression({
        expression: transform(rawASTNode.expression),
        member: rawASTNode.member,
        location: rawASTNode.location,
      } as astnodes.MemberExpression);
    case 'UnaryExpression':
      return new astnodes.UnaryExpression({
        operator: rawASTNode.operator,
        argumentExpression: transform(rawASTNode.argumentExpression),
        location: rawASTNode.location,
      } as astnodes.UnaryExpression);
    case 'FunctionExpression':
      return new astnodes.FunctionExpression({
        parameterPattern: transform(rawASTNode.parameterPattern),
        predicateExpression: rawASTNode.predicateExpression && transform(rawASTNode.predicateExpression),
        bodyExpression: transform(rawASTNode.bodyExpression),
        name: rawASTNode.name,
        location: rawASTNode.location,
      } as astnodes.FunctionExpression);
    //
    case 'TuplePattern':
      return new astnodes.TuplePattern({
        fieldPatterns: rawASTNode.fieldPatterns.map((pattern: ASTPatternNode) => transform(pattern)),
        fieldNames: rawASTNode.fieldNames,
        location: rawASTNode.location,
      } as astnodes.TuplePattern);
    case 'ConstructorPattern':
      return new astnodes.ConstructorPattern({
        name: rawASTNode.name,
        argumentPattern: transform(rawASTNode.argumentPattern),
        location: rawASTNode.location,
      } as astnodes.ConstructorPattern);
    case 'NumericLiteralPattern':
      return new astnodes.NumericLiteralPattern({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.NumericLiteralPattern);
    case 'StringLiteralPattern':
      return new astnodes.StringLiteralPattern({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.StringLiteralPattern);
    case 'BooleanLiteralPattern':
      return new astnodes.BooleanLiteralPattern({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.BooleanLiteralPattern);
    case 'ArrayLiteralPattern':
      return new astnodes.ArrayLiteralPattern({
        elementPatterns: rawASTNode.elementPatterns.map((pattern: ASTPatternNode) => transform(pattern)),
        restPattern: rawASTNode.restPattern && transform(rawASTNode.restPattern),
        defaultExpression: rawASTNode.defaultExpression && transform(rawASTNode.defaultExpression),
        location: rawASTNode.location,
      } as astnodes.ArrayLiteralPattern);
    case 'IdentifierPattern':
      return new astnodes.IdentifierPattern({
        name: rawASTNode.name,
        defaultExpression: rawASTNode.defaultExpression && transform(rawASTNode.defaultExpression),
        location: rawASTNode.location,
      } as astnodes.IdentifierPattern);
    //
    case 'BooleanLiteral':
      return new astnodes.BooleanLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.BooleanLiteral);
    case 'NumericLiteral':
      return new astnodes.NumericLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.NumericLiteral);
    case 'StringLiteral':
      return new astnodes.StringLiteral({
        value: rawASTNode.value,
        location: rawASTNode.location,
      } as astnodes.StringLiteral);
    case 'ArrayLiteral':
      return new astnodes.ArrayLiteral({
        elementExpressions: rawASTNode.elementExpressions.map((expression: ASTNode) => transform(expression)),
        location: rawASTNode.location,
      } as astnodes.ArrayLiteral);
    case 'DictLiteral':
      return new astnodes.DictLiteral({
        entryExpressions: rawASTNode.entryExpressions
          .map(([key, expression]: [ASTNode, ASTNode]) => [transform(key), transform(expression)]),
        location: rawASTNode.location,
      } as astnodes.DictLiteral);
    case 'AstLiteral':
      return new astnodes.AstLiteral({
        value: transform(rawASTNode.value),
        location: rawASTNode.location,
      } as astnodes.AstLiteral);
    case 'Identifier':
      return new astnodes.Identifier({
        name: rawASTNode.name,
        location: rawASTNode.location,
      } as astnodes.Identifier);
    default:
      console.warn('No transform found for', rawASTNode);

      throw new Error(`No transform found for ${rawASTNode}.`);
  }
}

function evaluate(astNode: ASTNode, environment: Environment, bind: Bind) {
  const context = { environment, evaluate, bind };

  if (astNode instanceof astnodes.Assignment) {
    return visitors.Assignment(astNode, context);
  } else if (astNode instanceof astnodes.BlockExpression) {
    return visitors.BlockExpression(astNode, context);
  } else if (astNode instanceof astnodes.PipeExpression) {
    return visitors.PipeExpression(astNode, context);
  } else if (astNode instanceof astnodes.OperatorExpression) {
    return visitors.OperatorExpression(astNode, context);
  } else if (astNode instanceof astnodes.ConditionalExpression) {
    return visitors.ConditionalExpression(astNode, context);
  } else if (astNode instanceof astnodes.LogicalOrExpression) {
    return visitors.LogicalOrExpression(astNode, context);
  } else if (astNode instanceof astnodes.LogicalAndExpression) {
    return visitors.LogicalAndExpression(astNode, context);
  } else if (astNode instanceof astnodes.ApplyExpression) {
    return visitors.ApplyExpression(astNode, context);
  } else if (astNode instanceof astnodes.RangeExpression) {
    return visitors.RangeExpression(astNode, context);
  } else if (astNode instanceof astnodes.MemberExpression) {
    return visitors.MemberExpression(astNode, context);
  } else if (astNode instanceof astnodes.UnaryExpression) {
    return visitors.UnaryExpression(astNode, context);
  } else if (astNode instanceof astnodes.FunctionExpression) {
    return visitors.FunctionExpression(astNode, context);
  } else if (astNode instanceof astnodes.TupleExpression) {
    return visitors.TupleExpression(astNode, context);
  } else if (astNode instanceof astnodes.BooleanLiteral) {
    return visitors.BooleanLiteral(astNode);
  } else if (astNode instanceof astnodes.NumericLiteral) {
    return visitors.NumericLiteral(astNode);
  } else if (astNode instanceof astnodes.StringLiteral) {
    return visitors.StringLiteral(astNode);
  } else if (astNode instanceof astnodes.ArrayLiteral) {
    return visitors.ArrayLiteral(astNode, context);
  } else if (astNode instanceof astnodes.DictLiteral) {
    return visitors.DictLiteral(astNode, context);
  } else if (astNode instanceof astnodes.AstLiteral) {
    return astNode.value;
  } else if (astNode instanceof astnodes.Identifier) {
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
