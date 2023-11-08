# Let's Build a Programming Language

## Introduction

You might think that you’d need to be a ninja-level coder, with a myriad of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

### The Language

The language we're going to build in this tutorial will be very simple, but it will support integers, variables and variable assignment, math operations, and defining and calling functions with one argument.

Our final program will look like this:

```
f = x => x + 1
f 2
```

## Syntax and Grammar

One of the first things we need to think about when writing a programming languages is "What does it look like?". We also need to think about how we can combine smaller pieces of code to create larger programs.

The syntax of the languages defines all the symbols and special words used in the language, and the grammar defines how those symbols and words can be used together to make a program. Unlike written languages such as English, computer programs must be written very clearly, with no ambiguities.

### Expressions

A core concept of many programming languages is an expression. Anything that results in a value is considered an expression. The expression `5`, for example, results in the value `5`. The expression `2 + 3` also results in the value `5`.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

### The Parser

A key concept in allowing the computer to run a program, is translating program text, which we call source code, into something the computer can understand. We call this parsing. The descrete items of text we parse, such as numbers and mathematical operators, are called tokens.

### Tokens

```
  b  +  1
  \  \  \
   \  \  a number token
    \  an operator token
     an identifier token
```

In this example program, we have three types of tokens - an identifier, used for variable names, the + operator, and a number.


Semantics

### Parser Rules

Rules? We don't need no stinkin' rules! Actually, yes we do - and a lots of them. A parser rule tells the computer how to handle text and symbols that it encounters while reading source code. Rules are combined in different ways to build the language grammar.

The parser has it's own language, which we need to use to explain our parsing rules.

Let's start with a very simple rule - reading numbers. We use the Peggy JavaScript library for parsing the source code.

```
NumericLiteral
  = value:[0-9]+ {
      return Number(value.join(''));
    }
```

Here, we've defined a parser rule called `NumericLiteral`, which defines how to read a number from text, and how to convert it from text to an actual number. It's using *regular expressions* to describe what a valid number looks like, and returns the number found. `value` is the result of the regular expression match, an array of digits. We need to first combine the array elements into a string before converting it to a number.

We need to add a few more pieces to tell the parser where to start, and to provide source code for it to parse.

```peggy
{
  input = "5";
}

Expression
  = NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return Number(value.join(''));
    }
```

The `{ input = "5" }` section provides the source code for the parser. The `Expression` rule allows us to later write the interpreter. The first rule defined is the rule used to parse the source code.


## Abstract Syntax Tree

Returning just the value of a number when we encounter a number while parsing doesn't give us the flexability we need to run a larger program. What we need to do is provide details of what we parsed. While parsing, we may also build a hierarchy of these things. That's where an *Abstract Syntax Tree*, or *AST* comes into play.

### Nodes

An AST Node describes the value or operation that was parsed by a particular rule. Nodes are later used by an interpreter or compiler to run the program, or create an executable. It's common to use a `type` property to describe the node, along with other properties specific to the type of node. For our number rule, we'll use type `NumericLiteral`, and provide the value in a `value` property.

```peggy
{
  input = "5";
}

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }
```

Instead of returning the number 5 as we did in the previous example, we now create an *AST node* that represents the number in a consistent way. We return an object with a property `type`, which describes what kind of node it is, and a `value` property to store the number itself.

### Visitors

Now that our number rule returns an AST Node, we can run our program (which can only be a number) by implementing an *AST Visitor*. The visitor pattern, in programming terminology, allows us to define what we want to do when we traverse the syntax tree and encounter a node. We can map the visitor name directly to the AST type property.

We first need to create a `visitors` object that contains our `NumericLiteral` visitor function. Next, we need to add a `Program` rule which is the core of the interpreter. It simply looks up the visitor by name using the node `type` property, and calls the visitor function. You'll see later that this pattern is very flexible, allowing us to add other types of nodes very easily.


```peggy
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
      return visitors[expression.type](expression);
    }

Expression
  = NumericLiteral

NumericLiteral                    // Collapse
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',   // Highlight
        value: Number(value.join(''))
      };
    }
```

This is a complete interpreter, which parses input and returns the value of the text input. Of course, it's very limited because it only accepts numbers. Later we'll add support for mathematical operations such as addition and subtraction.

## Math Operations

Parsing, interpreting, and returning a number is a great start. It sounds silly, but it helped us prepare for more complex rules.

### Addition

```peggy
{
  input = "2+3";

  const visitors = {
    NumericLiteral: ({ value }) => {
      return value;
    },

    AdditionExpression: ({ leftExpression, rightExpression }) => {
      return visit(leftExpression) + visit(rightExpression);
    }
  };

  function visit(node) {
    return visitors[node.type](node);
  }
}

Program
  = expression:Expression {
      return visit(expression);
    }

Expression
  = AdditionExpression

AdditionExpression
  = leftExpression:NumericLiteral "+" rightExpression:NumericLiteral {
      return {
        type: 'AdditionExpression',
        leftExpression,
        rightExpression
      }
    }
  / NumericLiteral

NumericLiteral
  = value:[0-9]+ {
      return {
        type: 'NumericLiteral',
        value: Number(value.join(''))
      };
    }
```

Now we're cooking - we can add two numbers together! Ok, maybe not that exciting, but it shows that using the visitor pattern allows us to add new functionality without having to change much of the existing code.
