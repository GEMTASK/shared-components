/* eslint-disable import/no-anonymous-default-export */

import * as parser from './lib/parser.mjs';

import { RawASTNode, ASTNode, ASTPatternNode, Environment, Bind, KopiValue } from './types.js';

import * as astnodes from './astnodes.js';
import * as visitors from './visitors.js';

import { inspect } from './utils.js';

import { KopiBoolean, KopiNumber, KopiString } from './index.js';

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
        initPattern: rawASTNode.initPattern && transform(rawASTNode.initPattern),
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
        value: new KopiBoolean(rawASTNode.value),
        location: rawASTNode.location,
      } as astnodes.BooleanLiteral);
    case 'NumericLiteral':
      return new astnodes.NumericLiteral({
        value: new KopiNumber(rawASTNode.value),
        location: rawASTNode.location,
      } as astnodes.NumericLiteral);
    case 'StringLiteral':
      return new astnodes.StringLiteral({
        value: new KopiString(rawASTNode.value),
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

      throw new Error(`No transform found for ${rawASTNode.type}.`);
  }
}

async function evaluate(astNode: ASTNode, environment: Environment, bind: Bind): Promise<KopiValue> {
  const context = { environment, evaluate, bind };

  switch (astNode.constructor) {
    case astnodes.BooleanLiteral:
      return (astNode as astnodes.BooleanLiteral).value;
    case astnodes.NumericLiteral:
      return (astNode as astnodes.NumericLiteral).value;
    case astnodes.StringLiteral:
      return (astNode as astnodes.StringLiteral).value;
    case astnodes.OperatorExpression: {
      const { environment, evaluate, bind } = context;

      const [leftValue, rightValue] = await Promise.all([
        evaluate((astNode as astnodes.OperatorExpression).leftExpression, environment, bind),
        evaluate((astNode as astnodes.OperatorExpression).rightExpression, environment, bind),
      ]);

      if (leftValue instanceof KopiNumber && rightValue instanceof KopiNumber) {
        switch ((astNode as astnodes.OperatorExpression).operator) {
          case '+': return new KopiNumber(leftValue.value + rightValue.value);
          case '-': return new KopiNumber(leftValue.value - rightValue.value);
          case '*': return new KopiNumber(leftValue.value * rightValue.value);
          case '/': return new KopiNumber(leftValue.value / rightValue.value);
          case '%': return new KopiNumber(leftValue.value % rightValue.value);
          case '^': return new KopiNumber(leftValue.value ** rightValue.value);
        }
      }

      return leftValue.invoke((astNode as astnodes.OperatorExpression).operator, [rightValue, context]);
    }
    case astnodes.Assignment: {
      const { environment, evaluate, bind } = context;

      const expressionValue = await evaluate((astNode as astnodes.Assignment).expression, environment, bind);
      const patternMatches = await (astNode as astnodes.Assignment).pattern.match(expressionValue, context);

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

      return undefined as any;
    }
    case astnodes.LogicalOrExpression: {
      const { environment, evaluate, bind } = context;

      const leftValue = await evaluate((astNode as astnodes.LogicalOrExpression).leftExpression, environment, bind);

      if ((leftValue as KopiBoolean).value) {
        return KopiBoolean.true;
      }

      const rightValue = await evaluate((astNode as astnodes.LogicalOrExpression).rightExpression, environment, bind);

      if ((rightValue as KopiBoolean).value) {
        return KopiBoolean.true;
      }

      return KopiBoolean.false;
    }
    case astnodes.LogicalAndExpression: {
      const { environment, evaluate, bind } = context;

      const leftValue = await evaluate((astNode as astnodes.LogicalAndExpression).leftExpression, environment, bind);

      if ((leftValue as KopiBoolean).value) {
        const rightValue = await evaluate((astNode as astnodes.LogicalAndExpression).rightExpression, environment, bind);

        if ((rightValue as KopiBoolean).value) {
          return KopiBoolean.true;
        }
      }

      return KopiBoolean.false;
    }
    default:
      if (astNode instanceof astnodes.BlockExpression) {
        return visitors.BlockExpression(astNode, context);
      } else if (astNode instanceof astnodes.PipeExpression) {
        return visitors.PipeExpression(astNode, context);
      } else if (astNode instanceof astnodes.ConditionalExpression) {
        return visitors.ConditionalExpression(astNode, context);
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
}

async function interpret(source: string, environment: Environment, bind: Bind) {
  var rootAst = parser.parse(source);

  if (rootAst) {
    return evaluate(transform(rootAst), environment, bind);
  }
}

export default {
  evaluate,
  interpret,
  inspect,
};

export {
  evaluate,
  interpret,
  inspect,
};

export {
  KopiValue,
  type Context,
} from './types.js';

export {
  KopiAny,
  KopiNumber,
  KopiString,
  KopiBoolean,
  KopiTuple,
  KopiRange,
  KopiArray,
  KopiDict,
  KopiFunction,
  KopiAstLiteral,
  KopiStream_T,
  KopiDate,
} from './classes/index.js';

export {
  kopi_apply,
  kopi_context,
  kopi_eval,
  kopi_extend,
  kopi_fetch,
  kopi_ident,
  kopi_let,
  kopi_loop,
  kopi_match,
  kopi_random,
  kopi_repeat,
  kopi_sleep,
  kopi_spawn,
  kopi_struct,
} from './functions/core.js';
