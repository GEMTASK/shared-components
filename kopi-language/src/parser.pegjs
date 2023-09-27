//
// Expressions
//

Program
  = __ head:Statement? tail:(_ (Newline _)+ Statement)* __ {
      return tail.length === 0 ? head : {
        type: 'BlockExpression',
        statements: tail.reduce(
          (statements, [, , statement]) => [...statements, statement],
          head ? [head] : []
        ),
      };
    }

Statement
  = Assignment
  / Expression

Assignment
  = identifierPattern:IdentifierPattern _ parameterPatterns:(_ PrimaryPattern)* _ "=" _ expression:Expression {
      return {
        type: 'Assignment',
        pattern: identifierPattern,
        expression: parameterPatterns.reverse().reduce((bodyExpression, [, parameterPattern], index) => ({
          type: 'FunctionExpression',
          parameterPattern,
          bodyExpression,
          name: index === 0 ? identifierPattern.name : undefined
        }), expression)
      }
  }
  / pattern:PrimaryPattern _ "=" _ expression:Expression {
      return {
        type: 'Assignment',
        pattern,
        expression,
      }
    }

Expression
  = PipeExpression

PipeExpression
  = head:ConcatExpression tail:(_ Newline* _ "|" _ Identifier _ FunctionExpression? (_ FunctionExpression)*)* {
      return tail.reduce((expression, [, , , , , identifier, , argumentExpression, argumentExpressions]) => {
        const pipelineExpression = {
          type: 'PipeExpression',
          expression,
          methodName: identifier.name,
          argumentExpression,
          location: location(),
        }

        return argumentExpressions.reduce((expression, [, argumentExpression]) => ({
          type: 'ApplyExpression',
          expression,
          argumentExpression,
        }), pipelineExpression);
      }, head);
    }

ConcatExpression
  = head:ConditionalExpression tail:(_ ("++" / "<<") _ ConcatExpression)? {
      const [, operator, , rightExpression] = tail ?? [];

      return !tail ? head : {
        type: 'OperatorExpression',
        operator,
        leftExpression: head,
        rightExpression
      };
    }

ConditionalExpression
  = head:LogicalOrExpression tail:(_ "?" _ consequent:ConcatExpression _ ":" _ alternate:ConcatExpression)? {
      const [, , , consequent, , , , alternate] = tail ?? [];

      return !tail ? head : {
        type: 'ConditionalExpression',
        expression: head,
        consequent,
        alternate
      }
    }
  / LogicalOrExpression

LogicalOrExpression
  = head:LogicalAndExpression tail:(_ "||" _ LogicalAndExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'LogicalOrExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
      }), head);
    }

LogicalAndExpression
  = head:EqualityExpression tail:(_ "&&" _ EqualityExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'LogicalAndExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
      }), head);
    }

EqualityExpression
  = head:RelationalExpression tail:(_ ("==" / "!=") _ RelationalExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

RelationalExpression
  = head:AddExpression tail:(_ ("<=" / ">=" / "<" / ">") _ AddExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

MultiplyExpression
  = head:ExponentExpression tail:(_ ("*" / "/" / "%") _ ExponentExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

ExponentExpression
  = leftExpression:ApplyExpression tail:(_ "^" _ rightExpression:ExponentExpression)? {
      const [, , , rightExpression] = tail ?? [];

      return !tail ? leftExpression : {
        type: 'OperatorExpression',
        operator: "^",
        leftExpression,
        rightExpression,
        location: location(),
       }
    }

ApplyExpression
  = expression:FunctionExpression _arguments:(_ FunctionExpression)* {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    }

FunctionExpression
  = parameterPattern:Pattern _ Newline* _ predicateExpression:("[" _ ConcatExpression _ "]")? _ "=>" _ Newline* _ bodyExpression:ConcatExpression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        predicateExpression: predicateExpression && predicateExpression[2],
        bodyExpression,
      }
    }
  / RangeExpression

RangeExpression
  = from:MemberExpression _ ".." _ to:MemberExpression {
      return {
        type: 'RangeExpression',
        from,
        to,
      };
    }
  / MemberExpression

MemberExpression
  = head:UnaryExpression tail:(".(" _ Expression _ ")")+ {
      return tail.reduce((expression, [, , argumentExpression]) => ({
        type: 'PipeExpression',
        expression,
        methodName: 'at',
        argumentExpression,
        location: location(),
      }), head);
    }
  / head:UnaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expression, [, member]) => ({
        type: 'MemberExpression',
        expression,
        member: member.name ?? member.value,
      }), head);
    }

UnaryExpression
  = operator:("-" / "!") argumentExpression:UnaryExpression {
      return {
        type: 'UnaryExpression',
        operator: operator === '-' ? '$-' : operator,
        argumentExpression,
      };
    }
  / PrimaryExpression

PrimaryExpression
  = "(" _ ")" _ !"=>" {
      return {
        type: 'TupleExpression',
        fieldExpressions: [],
        fieldNames: [],
      }
    }
  / "(" __ head:TupleField tail:(_ ("," /  Newline+) _ TupleField)* __ ")" _ !"=>" {
      return !head.name && tail.length === 0 ? head.expression : {
        type: 'TupleExpression',
        fieldExpressions: tail.reduce((expressions, [, , , field]) => [
          ...expressions,
          field.expression
        ], [head.expression]),
        fieldNames: tail.reduce((fieldNames, [, , , field]) => [
          ...fieldNames,
          field.name
        ], [head.name])
      };
    }
  / boolean:BooleanLiteral _ !"=>" {
    return boolean;
  }
  / number:NumericLiteral _ !"=>" {
    return number;
  }
  / StringLiteral
  / ArrayLiteral
  / DictLiteral
  / AstLiteral
  / BlockExpression
  / identifier:Identifier _ !"=>" {
      return identifier;
    }

TupleField
  = name: ((Identifier / Operator) ":")? _ expression:Expression {
      return {
        name: name && name[0].name,
        expression
      }
    }

BlockExpression
  = "{" statements:Block "}" {
    return statements;
  }

Block
  = __ head:Statement? tail:(_ (Newline _)+ Statement)* __ {
      return {
        type: 'BlockExpression',
        statements: tail.reduce(
          (statements, [, , statement]) => [...statements, statement],
          head ? [head] : []
        ),
      };
    }

//
// Patterns
//

Pattern
  = DefaultExpressionPattern
  / PrimaryPattern

DefaultExpressionPattern
  = pattern:PrimaryPattern _ "=" _ defaultExpression:Expression {
      return {
        ...pattern,
        defaultExpression,
      }
    }

PrimaryPattern
  = "(" _ ")" {
      return {
        type: "TuplePattern",
        fieldPatterns: [],
      }
    }
  / "(" _ colon:(":")? head:Pattern tail:(_ "," _ (":")? Pattern)* _ ")" {
      return !colon && tail.length === 0 ? head : {
        type: 'TuplePattern',
        fieldPatterns: tail.reduce((patterns, [, , , , pattern]) => [
          ...patterns,
          pattern,
        ], [head]),
        fieldNames: tail.reduce((fieldNames, [, , , colon, fieldName]) => [
          ...fieldNames,
          colon && fieldName.name,
        ], [colon && head.name])
      }
    }
  / ConstructorPattern
  / ArrayLiteralPattern
  / NumericLiteralPattern
  / StringLiteralPattern
  / BooleanLiteralPattern
  / IdentifierPattern

ConstructorPattern
  = typename:Typename _ argumentPattern:Pattern {
      return {
        type: 'ConstructorPattern',
        name: typename.name,
        argumentPattern
      }
    }

ArrayLiteralPattern
  = "[" _ "]" _ !"=>" {
    return {
      type: 'ArrayLiteralPattern',
      elementPatterns: [],
    }
  }
  / init:(IdentifierPattern _ "++" _)? "[" _ head:Pattern? tail:(_ "," _ Pattern)* _ "]" rest:(_ "++" _ IdentifierPattern)? {
    return {
      type: 'ArrayLiteralPattern',
      elementPatterns: tail.reduce((patterns, [, , , pattern]) => [
        ...patterns,
        pattern
      ], [head]),
      initPattern: init && init[0],
      restPattern: rest && rest[3]
    }
  }

NumericLiteralPattern
  = number:NumericLiteral {
      return {
        type: 'NumericLiteralPattern',
        value: number.value,
      }
    }

StringLiteralPattern
  = string:StringLiteral {
      return {
        type: 'StringLiteralPattern',
        value: string.value,
      }
    }

BooleanLiteralPattern
  = boolean:BooleanLiteral {
      return {
        type: 'BooleanLiteralPattern',
        value: boolean.value,
      }
    }

IdentifierPattern
  = identifier:Identifier {
      return {
        type: 'IdentifierPattern',
        name: identifier.name,
      };
    }

//
// Literals
//

BooleanLiteral "boolean"
  = value:("true" / "false") {
      return {
        type: 'BooleanLiteral',
        value: text() === 'true',
        location: location(),
      };
    }

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?) {
      return ({
        type: 'NumericLiteral',
        value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
        location: location(),
      });
    }

StringLiteral "string"
  = _ "\"" value:("\\\"" / [^"])* "\"" _ {
      return {
        type: 'StringLiteral',
        value: value.join('').replace(/\\"/g, '"'),
        location: location(),
      };
    }

ArrayLiteral
  = "[" __ head:Expression? tail:(_ ("," / Newline+) _ Expression)* __ "]" _ !"=>" {
      return {
        type: 'ArrayLiteral',
        elementExpressions: !head ? [] : tail.reduce((elementExpressions, [, , , elementExpression]) =>
          [...elementExpressions, elementExpression], [head]),
      }
    }

DictLiteral
  = "{" __ head:(PrimaryExpression ":" _ Expression)? tail:(_ ("," / Newline+) _ PrimaryExpression ":" _ Expression)* __ "}" _ !"=>" {
      return {
        type: 'DictLiteral',
        entryExpressions: !head ? [] : tail.reduce((entryExpressions, [, , , key, , , value]) =>
          [...entryExpressions, [key, value]], [[head[0], head[3]]]),
      }
    }

AstLiteral "ast-literal"
  = "'(" _ operator:Operator _ argumentExpression:ApplyExpression ")" {
      return {
        type: 'AstLiteral',
        value: {
          type: 'ApplyExpression',
          expression: {
            type: 'Identifier',
            name: operator.name
          },
          argumentExpression
        }
      };
    }
  / "'" operator:Operator {
      return {
        type: 'AstLiteral',
        value: {
          type: 'Identifier',
          name: operator.name
        },
      };
    }
  / "'" expression:PrimaryExpression {
      return {
        type: 'AstLiteral',
        value: expression,
      };
    }

Identifier "identifier"
  = name:([_a-zA-Z][_a-zA-Z0-9]*) {
      return ({
        type: 'Identifier',
        name: name[0] + name[1].join('')
      });
    }

Operator "operator"
  = name:("++" / "<<" / "+" / "-" / "*" / "/" / "%" / "^") {
      return ({
        type: 'Identifier',
        name: name
      });
    }

Typename "typename"
  = name:([A-Z][_a-zA-Z0-9]*) {
      return ({
        type: 'Typename',
        name: name[0] + name[1].join('')
      });
    }

//
// Miscellaneous
//

_ "space"
  = " "*

__ "whitespace"
  = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
