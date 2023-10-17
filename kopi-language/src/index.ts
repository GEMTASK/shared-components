import * as parser from './lib/parser.mjs';

import { RawASTNode, ASTNode, ASTPatternNode, Environment, Bind, KopiValue } from './types.js';

import * as astnodes from './astnodes.js';
import * as visitors from './visitors.js';
import * as functions from './functions/core.js';

import { getSymbol, inspect } from './utils.js';

import { KopiAny, KopiBoolean, KopiNumber, KopiString, KopiArray, KopiDict, KopiTuple, KopiDate } from './index.js';

const plusSymbol = getSymbol('+');
const minusSymbol = getSymbol('-');
const timesSymbol = getSymbol('*');
const divideSymbol = getSymbol('/');
const remainerSymbol = getSymbol('%');
const exponentSymbol = getSymbol('^');
const lessThanSymbol = getSymbol('<');
const lessThanOrEqualSymbol = getSymbol('<=');
const greaterThanSymbol = getSymbol('>');
const greaterThanOrEqualSymbol = getSymbol('>=');

//
// transform()
//

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
        methodSymbol: getSymbol(rawASTNode.methodName),
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
        operator: getSymbol(rawASTNode.operator),
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
        operator: getSymbol(rawASTNode.operator),
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
        defaultExpression: rawASTNode.defaultExpression && transform(rawASTNode.defaultExpression),
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
        value: rawASTNode.value,
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
        symbol: getSymbol(rawASTNode.name),
        location: rawASTNode.location,
      } as astnodes.Identifier);
    default:
      console.warn('No transform found for', rawASTNode);

      throw new Error(`No transform found for ${rawASTNode.type}.`);
  }
}

//
// evaluate()
//

async function evaluate(astNode: ASTNode, environment: Environment, bind: Bind): Promise<KopiValue> {
  const context = { environment, evaluate, bind };

  switch (astNode.constructor) {
    case astnodes.BooleanLiteral:
      return (astNode as astnodes.BooleanLiteral).value;
    case astnodes.NumericLiteral:
      return (astNode as astnodes.NumericLiteral).value;
    case astnodes.StringLiteral:
      return (astNode as astnodes.StringLiteral).value;
    case astnodes.AstLiteral:
      return (astNode as astnodes.AstLiteral).value;
    case astnodes.Identifier: {
      let value = environment[(astNode as astnodes.Identifier).symbol];

      if (value !== undefined) {
        console.log((astNode as astnodes.Identifier).symbol);

        return value;
      }

      value = environment[(astNode as astnodes.Identifier).symbol.description as any];

      if (value !== undefined) {
        return value;
      }

      throw new ReferenceError(`Variable "${(astNode as astnodes.Identifier).symbol.description}" not found in current scope.`);
    }
    case astnodes.OperatorExpression: {
      const [leftValue, rightValue] = await Promise.all([
        evaluate((astNode as astnodes.OperatorExpression).leftExpression, environment, bind),
        evaluate((astNode as astnodes.OperatorExpression).rightExpression, environment, bind),
      ]);

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        const operator = (astNode as astnodes.OperatorExpression).operator;

        switch (operator) {
          case plusSymbol: return leftValue + rightValue;
          case minusSymbol: return leftValue - rightValue;
          case timesSymbol: return leftValue * rightValue;
          case divideSymbol: return leftValue / rightValue;
          case remainerSymbol: return leftValue % rightValue;
          case exponentSymbol: return leftValue ** rightValue;
          case lessThanSymbol: return new KopiBoolean(leftValue < rightValue);
          case lessThanOrEqualSymbol: return new KopiBoolean(leftValue <= rightValue);
          case greaterThanSymbol: return new KopiBoolean(leftValue > rightValue);
          case greaterThanOrEqualSymbol: return new KopiBoolean(leftValue >= rightValue);
        }
      }

      return leftValue.invoke(leftValue, (astNode as astnodes.OperatorExpression).operator, [rightValue, context]);
    }
    case astnodes.Assignment: {
      const expressionValue = await evaluate((astNode as astnodes.Assignment).expression, environment, bind);
      const patternMatches = await (astNode as astnodes.Assignment).pattern.match(expressionValue, context);

      for (const match in patternMatches) {
        const value = patternMatches[match] as any;

        if (typeof value === 'object' && 'iterable' in value) {
          patternMatches[match] = value.fromIterable(value.iterable);
        }

        if (value.constructor.name === 'Vector') {
          if (!environment[match] && (value as any)?._referenced) {
            console.log('Vector copied');

            patternMatches[match] = new value.constructor([...value._elements]);
          } else {
            value._referenced = true;
          }
        }
      }

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
      const leftValue = await evaluate((astNode as astnodes.LogicalAndExpression).leftExpression, environment, bind);

      if ((leftValue as KopiBoolean).value) {
        const rightValue = await evaluate((astNode as astnodes.LogicalAndExpression).rightExpression, environment, bind);

        if ((rightValue as KopiBoolean).value) {
          return KopiBoolean.true;
        }
      }

      return KopiBoolean.false;
    }
    case astnodes.ArrayLiteral: {
      return new KopiArray(
        (astNode as astnodes.ArrayLiteral).elementExpressions.map((expression) => evaluate(expression, environment, bind))
      );
    }
    case astnodes.DictLiteral: {
      return KopiDict.fromIterable(
        new KopiArray(
          (astNode as astnodes.DictLiteral).entryExpressions.map(([key, expression]) => new KopiTuple([
            evaluate(key, environment, bind),
            evaluate(expression, environment, bind)
          ]))
        ) as AsyncIterable<KopiTuple>
      );
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
      } else {
        console.warn('No visitor found for', astNode);

        throw new Error(`No visitor found for ${astNode.constructor.name}.`);
      }
  }
}

let globalEnvironment: Environment = {
  [getSymbol('PI')]: Math.PI,
  [getSymbol('E')]: Math.E,
  //
  [getSymbol('Any')]: KopiAny,
  [getSymbol('Tuple')]: KopiTuple,
  [getSymbol('Array')]: KopiArray,
  [getSymbol('String')]: KopiString,
  [getSymbol('Number')]: KopiNumber,
  [getSymbol('Boolean')]: KopiBoolean,
  [getSymbol('Dict')]: KopiDict,
  [getSymbol('Date')]: KopiDate,
  //
  [getSymbol('let')]: functions.kopi_let,
  [getSymbol('loop')]: functions.kopi_loop,
  [getSymbol('match')]: functions.kopi_match,
  [getSymbol('apply')]: functions.kopi_apply,
  [getSymbol('eval')]: functions.kopi_eval,
  [getSymbol('ident')]: functions.kopi_ident,
  [getSymbol('sleep')]: functions.kopi_sleep,
  [getSymbol('fetch')]: functions.kopi_fetch,
  [getSymbol('random')]: functions.kopi_random,
  [getSymbol('repeat')]: functions.kopi_repeat,
  [getSymbol('struct')]: functions.kopi_struct,
  [getSymbol('extend')]: functions.kopi_extend,
  [getSymbol('spawn')]: functions.kopi_spawn,
  [getSymbol('context')]: functions.kopi_context,
};

const bind = (bindings: { [name: string]: KopiValue; }) => {
  const newEnvironment = { ...globalEnvironment, ...bindings };

  globalEnvironment = newEnvironment;
};

async function interpret(source: string, environment: Environment = {}) {
  const rootAst = parser.parse(source);

  if (rootAst) {
    return evaluate(transform(rootAst), { ...globalEnvironment, ...environment }, bind);
  }
}

export default {
  evaluate,
  interpret,
  inspect,
};

export {
  getSymbol,
  evaluate,
  interpret,
  inspect,
};

export {
  KopiClass,
  type KopiValue,
  type Environment,
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
