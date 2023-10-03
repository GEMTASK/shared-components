# Let's Build a Programming Language

You might think that you’d need to be a ninja-level coder, with a bunch of tools and libraries by your side to create a programming language. In reality, if you just want to build a very simple, very basic language to learn how it’s done, it’s not that difficult.

This tutorial will guide you through the steps of creating a simple programming language, interactively. Even if you're not a developer, you can follow along and try the examples.

In the next section, Syntax and Grammar, we’ll talk about the building blocks of creating a language.

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

## Introduction

## Syntax and Grammar

## Abstract Syntax Tree

## Parser Rules
