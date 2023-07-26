//
// Expressions
//

Program
  = __ expr:Statement __ {
    return expr;
  }

Statement
  = Assignment
  / Expression

Assignment
  = pattern:PrimaryPattern __ "=" __ expression:Expression {
      return {
        type: 'AssignmentStatement',
        pattern,
        expression,
      }
    }

Expression
  = AddExpression

AddExpression
  = head:MultiplyExpression tail:(__ ("+" / "-") __ MultiplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

MultiplyExpression
  = head:ApplyExpression tail:(__ ("*" / "/" / "%") __ ApplyExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

ApplyExpression
  = expression:PrimaryExpression _arguments:(__ PrimaryExpression)* {
      return _arguments.reduce((expression, [, argumentExpression]) => ({
        type: 'ApplyExpression',
        expression,
        argumentExpression,
      }), expression);
    }

PrimaryExpression
  = "(" __ ")" __ !"=>" {
      return {
        type: 'TupleExpression',
        fieldExpressions: [],
        fieldNames: [],
      }
    }
  / "(" __ head:Expression tail:(__ "," __ Expression)* __ ")" __ !"=>" {
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
  / AstLiteral
  / Identifier

FunctionExpression
  = parameterPattern:Pattern __ "=>" __ bodyExpression:Expression {
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
  = pattern:PrimaryPattern __ "=" __ defaultExpression:Expression {
      return {
        ...pattern,
        defaultExpression,
      }
    }

PrimaryPattern
  = "(" __ ")" {
      return {
        type: "TuplePattern",
        fieldPatterns: [],
      }
    }
  / "(" __ head:Pattern tail:(__ "," __ Pattern)* __ ")" {
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
  = __ "\"" value:[^"]* "\"" __ {
      return {
        type: 'StringLiteral',
        value: value.join(''),
        location: location(),
      };
    }

AstLiteral "ast-literal"
  = "'" expression:PrimaryExpression {
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

__ "whitespace"
  = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
