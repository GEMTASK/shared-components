//
// Expressions
//

Block
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
        expression: parameterPatterns.reduce((bodyExpression, [, parameterPattern], index) => ({
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
  = head:EqualityExpression tail:(_ "|" _ Identifier _ RangeExpression? (_ RangeExpression)*)* {
      return tail.reduce((expression, [, , , identifier, , argumentExpression, argumentExpressions]) => {
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
  = head:ApplyExpression tail:(_ ("*" / "/" / "%") _ ApplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

ApplyExpression
  = expression:RangeExpression _arguments:(_ RangeExpression)* {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    }

RangeExpression
  = from:PrimaryExpression _ ".." _ to:PrimaryExpression {
      return {
        type: 'RangeExpression',
        from,
        to,
      };
    }
  / MemberExpression

MemberExpression
  = head:UnaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expression, [, member]) => ({
        type: 'MemberExpression',
        expression,
        member: member.name ?? member.value,
      }), head);
    }

UnaryExpression
  = PrimaryExpression
  / operator:("-" / "!") argumentExpression:UnaryExpression {
      return {
        type: 'UnaryExpression',
        operator: operator === '-' ? '$-' : operator,
        argumentExpression,
      };
    }

PrimaryExpression
  = "(" _ ")" _ !"=>" {
      return {
        type: 'TupleExpression',
        fieldExpressions: [],
        fieldNames: [],
      }
    }
  / "(" __ fieldName:(Identifier ":")? _ head:Expression tail:(_ ("," /  Newline+) _ (Identifier ":")? _ Expression)* __ ")" _ !"=>" {
      return !fieldName && tail.length === 0 ? head : {
        type: 'TupleExpression',
        fieldExpressions: tail.reduce((expressions, [, , , , , expression]) => [
          ...expressions,
          expression
        ], [head]),
        fieldNames: tail.reduce((fieldNames, [, , , fieldName]) => [
          ...fieldNames,
          fieldName && fieldName[0].name
        ], [fieldName && fieldName[0].name])
      };
    }
  / FunctionExpression
  / BlockExpression
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral
  / ArrayLiteral
  / AstLiteral
  / Identifier

FunctionExpression
  = parameterPattern:Pattern _ "=>" _ bodyExpression:EqualityExpression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    }

BlockExpression
  = "{" statements:Block "}" {
    return statements;
  }

//
// Patterns
//

Pattern
  = DefaultExpressionPattern
  / PrimaryPattern

DefaultExpressionPattern
  = pattern:IdentifierPattern _ "=" _ defaultExpression:Expression {
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
  / "(" _ head:Pattern tail:(_ "," _ Pattern)* _ ")" {
      return tail.length === 0 ? head : {
        type: 'TuplePattern',
        fieldPatterns: tail.reduce((patterns, [, , , pattern]) => [
          ...patterns,
          pattern
        ], [head])
      }
    }
  / ArrayLiteralPattern
  / NumericLiteralPattern
  / IdentifierPattern

ArrayLiteralPattern
  = "[" _ "]" {
    return {
      type: 'ArrayLiteralPattern',
      elementPatterns: [],
    }
  }
  / "[" _ head:Pattern? tail:(_ "," _ Pattern)* _ "]" {
    return {
      type: 'ArrayLiteralPattern',
      elementPatterns: tail.reduce((patterns, [, , , pattern]) => [
        ...patterns,
        pattern
      ], [head])
    }
  }

//  = "[" _ head:Expression? tail:(_ "," _ Expression)* _ "]" _ !"=>" {

NumericLiteralPattern
  = number:NumericLiteral {
      return {
        type: 'NumericLiteralPattern',
        value: number.value,
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
  = _ "\"" value:[^"]* "\"" _ {
      return {
        type: 'StringLiteral',
        value: value.join(''),
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

AstLiteral "ast-literal"
  = "'(" _ operator:('+' / '-' / '*' / '/' / '%') _ argumentExpression:ApplyExpression ")" {
      return {
        type: 'AstLiteral',
        value: {
          type: 'ApplyExpression',
          expression: {
            type: 'Identifier',
            name: operator
          },
          argumentExpression
        }
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
