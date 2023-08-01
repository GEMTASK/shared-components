//
// Expressions
//

Program
  = _ expr:Statement? _ {
    return expr;
  }

Statement
  = Assignment
  / Expression

Assignment
  = pattern:PrimaryPattern _ "=" _ expression:Expression {
      return {
        type: 'AssignmentStatement',
        pattern,
        expression,
      }
    }

Expression
  = PipeExpression

PipeExpression
  = head:AddExpression tail:(_ "|" _ Identifier _ RangeExpression? (_ RangeExpression)*)* {
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
  = head:PrimaryExpression tail:("." (Identifier / NumericLiteral))* {
      return tail.reduce((expression, [, member]) => ({
        type: 'MemberExpression',
        expression,
        member: member.name ?? member.value,
      }), head);
    }

PrimaryExpression
  = "(" _ ")" _ !"=>" {
      return {
        type: 'TupleExpression',
        fieldExpressions: [],
        fieldNames: [],
      }
    }
  / "(" _ (Identifier ":" _)? head:Expression tail:(_ "," _ Expression)* _ ")" _ !"=>" {
      return tail.length === 0 ? head : {
        type: 'TupleExpression',
        fieldExpressions: tail.reduce((expressions, [, , , expression]) => [
          ...expressions,
          expression
        ], [head])
      };
    }
  / FunctionExpression
  / NumericLiteral
  / StringLiteral
  / ArrayLiteral
  / AstLiteral
  / Identifier

FunctionExpression
  = parameterPattern:Pattern _ "=>" _ bodyExpression:AddExpression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
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
  / "(" _ head:Pattern tail:(_ "," _ Pattern)* _ ")" {
      return tail.length === 0 ? head : {
        type: 'TuplePattern',
        fieldPatterns: tail.reduce((patterns, [, , , pattern]) => [
          ...patterns,
          pattern
        ], [head])
      }
    }
  / NumericLiteralPattern
  / IdentifierPattern

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
  = "[" _ head:Expression? tail:(_ "," _ Expression)* _ "]" _ !"=>" {
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

// __ "whitespace"
//   = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
