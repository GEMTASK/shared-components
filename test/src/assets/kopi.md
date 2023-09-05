# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It supports several literal types, and has pattern matching, lazy streams, and coroutines.

Within this document, you can edit any Kopi code that displays a value just below and see the results. Code in this markdown and in Terminal use the font *Iosevka*, which is a narrow, monospace font that support ligatures.

## Kopi Basics

There are only a handfull of rules that make up the syntax of Kopi, which can be nested and combined to create larger structures. In addition to the many literal types, patterns are used for variable assignment, destructuring, and matching values.

### Literal Types

There are several literal types in Kopi, including Number, String, Boolean, Range, ASTree, Tuple, Array, and Dict. Here are a few example of these types:

```
1  "2"  true  1..5  'foo  (1, "2")  [1, 2]  { 1: 2 }
```

### Operators

Let's start with some basic math. Kopi uses infix syntax for operators, with precedence rules similar to JavaScript and many other languages. The (unedited) code above will be parsed as `1 + (2 * (3 ^ 4))`.

Try editing the code below to see various results.

```kopi
1 + 2 * 3 ^ 4
```

There are other operators such as releational (`==` `!=` `>` `<` `<=` `>=`), logical (`&&` `||`), and concat/merge (`++` `<<`).

The conditional `? :` operator is used to test a value, and evaluate the true or false expression, respectively.

```kopi
-1 < 0 ? 1 : -1
```

### Variables

Assignment is just a simple form of pattern matching, which we'll discuss later. It uses the `=` character to bind a value to a variable (or variables). Unlike scripting languages, each assignment creates a new scope instead of overwriting the variables's value. We'll cover this in a little more detail when we get to functions.

```kopi
x = 10
x = x + 1
x
```

You can do multiple assignment by pattern matching a tuple. We'll see more patterns later.

```kopi
(a, b) = (1, 2)
(a, b)
```

### Tuples

Tuples, which are values in parenthesis separated by commas or newlines, allow you to group multiple values together, and can be assigned to variables or passed to functions.

```
(1, "Two", false)
```

You can name tuple fields to make code easier to read and work with, and mix and match non-named and named fields.

```
("Joe", 30)
(name: "Joe", age: 30)
("Joe", age: 30)
```

You can access tuple fields by index, or by name if one was provided.

```kopi
("Joe", age: (20, 30).1).age
```

### Functions

Kopi supports defining functions at the top level, and also supports anonymous functions, or closures that can be assigned to variables or passed to functions.

```kopi
square x = x * x
square 5
```

The same function defined as an anonymous function:

```
square = x => x * x
```

Default arguments can be provided which are applied when an empty value `()` is passed.

```kopi
square (x = 10) = x * x
square ()
```


### Loops

Iteration can be either done by recursion, or by using the `let` and `loop` functions. Let is a function which simply applies the empty value `()` to its argument, a function which provides default arguments. `loop` is also just a function, which lets the `let` function know you want to do another iteration.

```kopi
let (n = 0) => {
  n < 5 ? loop (n + 1) : n
}
```

### Methods

Methods in Kopi are defined externally from types using the `extend` function, and are invoked using the `|` character. Each method invocation with the pipe operator can be on its own line.

```kopi
30 | cos | toFixed 5

30
  | cos
  | toFixed 5
```

An alternate way to invoke a method is using an ASTree literal such as `'(toFixed 2)`, which is useful for passing to methods which take a function as an argument.

```kopi
1..3 | map '(toFixed 2)
```

### Ranges

A range is a type that stores `from` and `to` values, and supports all iterable methods such as `map` and `filter`. Any type that supports the `succ` and `<=` methods can be used in a range.

```kopi
[1..3, "a".."z"] | zip
```


# Reference

## Types

There are several literal types in Kopi, each having a mirror Pattern.

### Number

```
1   -2.5   3.14
```

Number methods

```
30 | sin     -0.988
```

### String
### Boolean
### Tuple
### Range
### Array
### Dict
### ASTree

## Patterns
## Functions
## Streams

Every iterable method such as `map` or `filter` returns a lazy stream, so no intermediate values are created. This allows you to work with large or infinite collections.

When a stream inspected in the Terminal or in this Markdown, it is automatically converted to an array. If you need to convert to an array explicitely, you can use `stream | toArray`.

```kopi
1..3 | repeat | take 5
```

## User Types

You can define your own types in Kopi, which look and behave just like native types.

```
Point = type (x: Number, y: Number)

extend Point (
  add: (that) => Point (this.x + that.x, this.y + that.y)
)

Point (1, 2) | add (Point (2, 3))
```
