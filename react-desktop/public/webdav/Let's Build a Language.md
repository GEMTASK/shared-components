# Let's Build a Programming Language

## Introduction

You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

## Syntax and Grammar

```peggy-float
{
  input = "5";
}

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
```

You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

## Abstract Syntax Tree

```peggy-float
{
  input = "5";

  const visitors = {
    NumericLiteral: ({ value }) => {
      return value;
    }
  };
}

Program
  = expression:Expression {
      return visitors['NumericLiteral'](expression);
    }

Expression
  = NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
```

You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

## Parser Rules

```peggy-float
{
  input = "5";

  const visitors = {
    NumericLiteral: ({ value }) => {
      return value;
    }
  };
}

Program
  = expression:Expression {
      return visitors['NumericLiteral'](expression);
    }

Expression
  = NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(text())
      };
    }
```

You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

## Full Listing

```peggy-float
{
  class Function {
    constructor(parameter, bodyExpression, environment) {
      this.parameter = parameter;
      this.bodyExpression = bodyExpression;
      this.environment = environment;
    }

    apply(thisArg, [argument]) {
      return evaluate(this.bodyExpression, {
        ...this.environment,
        [this.parameter.name]: argument
      })
    }
  }

  const operators = {
    ['+']: (leftValue, rightValue) => leftValue + rightValue,
    ['-']: (leftValue, rightValue) => leftValue - rightValue,
    ['*']: (leftValue, rightValue) => leftValue * rightValue,
    ['/']: (leftValue, rightValue) => leftValue / rightValue
  }

  const visitors = {
    Block: (
      { statements }, environment
    ) => {
      const bindVariables = (bindings) => environment = ({
        ...environment, ...bindings
      });

      return statements.reduce((_, expression) => (
        evaluate(expression, environment, bindVariables)
      ), undefined);
    },

    Assignment: (
      { variable, expression }, environment, bindVariables
    ) => {
      bindVariables({
        [variable]: evaluate(expression, environment, bindVariables)
      });
    },

    OperatorExpression: (
      { operator, leftExpression, rightExpression }, environment
    ) => {
      const leftValue = evaluate(leftExpression, environment);
      const rightValue = evaluate(rightExpression, environment);

      return operators[operator](leftValue, rightValue, environment);
    },

    FunctionApplicationExpression(
      { expression, argument }, environment
    ) {
      const expressionValue = evaluate(expression, environment);
      const argumentValue = evaluate(argument, environment);

      return expressionValue.apply(
        undefined,
        [argumentValue, environment]
      );
    },

    FunctionExpression(
      { parameter, bodyExpression }, environment
    ) {
      return new Function(parameter, bodyExpression, environment);
    },

    NumericLiteral: (
      { value }
    ) => {
      return value;
    },

    Identifier: (
      { name }, environment
    ) => {
      return environment[name];
    }
  }

  function evaluate(node, environment, bindVariables) {
    return visitors[node.type](node, environment, bindVariables);
  }
}

Program
  = Newline* head:Statement? tail:(Newline+ Statement)* Newline* {
      const statements = {
        type: 'Block',
        statements: tail.reduce((statements, [, statement]) => (
          [...statements, statement]
        ), [head])
      };

      const environment = {};

      return evaluate(statements, environment);
    }

Statement
  = Assignment
  / Expression

Assignment
  = identifier:Identifier _ "=" _ expression:Expression {
    return {
      type: 'Assignment',
      variable: identifier.name,
      expression: expression
    };
  }

Expression
  = AddExpression

AddExpression
  = leftExpression:MultiplyExpression _
    operator:("+" / "-") _
    rightExpression:MultiplyExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / MultiplyExpression

MultiplyExpression
  = leftExpression:FunctionApplicationExpression _
    operator:("*" / "/") _
    rightExpression:FunctionApplicationExpression {
      return {
        type: 'OperatorExpression',
        operator: operator,
        leftExpression: leftExpression,
        rightExpression: rightExpression
      };
    }
  / FunctionApplicationExpression

FunctionApplicationExpression
  = expression:PrimaryExpression args:(_ PrimaryExpression)* {
      return args.reduce((expression, [, argument]) => ({
        type: 'FunctionApplicationExpression',
        expression: expression,
        argument: argument
      }), expression);
    }

PrimaryExpression
  = "(" _ expression:Expression _ ")" {
      return expression;
    }
  / FunctionExpression
  / NumericLiteral
  / Identifier

FunctionExpression
  = parameter:Identifier _ "=>" _ bodyExpression:Expression {
      return {
        type: 'FunctionExpression',
        parameter: parameter,
        bodyExpression: bodyExpression
      };
    }

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }

Identifier "identifier"
  = [a-z]+ {
      return {
        type: 'Identifier',
        name: text()
      }
    }

_ "whitespace"
  = [ \t]*

Newline
  = [\r?\n]
```

Asdf
