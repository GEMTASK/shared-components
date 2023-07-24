//
// Expressions
//

Program =
  __ expr:Expression __ {
    return expr;
  }

Expression
  = AddExpression

AddExpression
  = head:ApplyExpression tail:(__ ("+" / "-") __ ApplyExpression)* {
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
  = PrimaryPattern

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
  = identifier:Identifier expr:(__ "=" __ Expression)? {
      return {
        type: 'IdentifierPattern',
        name: identifier.name,
        defaultExpression: null,
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
