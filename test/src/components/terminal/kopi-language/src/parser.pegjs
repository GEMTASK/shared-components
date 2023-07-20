
Expression
  = AddExpression

AddExpression
  = head:PrimaryExpression tail:(__ ("+" / "-") __ PrimaryExpression)* {
      return tail.reduce((leftExpression, [, operator, , rightExpression]) => ({
        type: 'OperatorExpression',
        operator,
        leftExpression,
        rightExpression,
        location: location(),
       }), head);
    }

PrimaryExpression
  = "(" expr:Expression ")" !"=>" {
      return expr;
    }
  / FunctionExpression
  / NumericLiteral

FunctionExpression
  = parameterPattern:Pattern __ "=>" __ bodyExpression:Expression {
      return {
        type: "FunctionExpression",
        parameterPattern,
        bodyExpression,
      }
    }

Pattern
  = "(" __ ")"

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?) {
    return ({
      type: 'NumericLiteral',
      value: Number(`${value[0].join('')}.${value[1] ? value[1][2].join('') : ''}`),
      location: location(),
    });
  }

__ "whitespace"
  = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]
