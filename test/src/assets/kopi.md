# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It supports several literal types, and has pattern matching, lazy streams, and coroutines.

Within this document, you can edit any Kopi code that displays a value just below and see the results.

## Kopi Basics

There are only a handfull of rules that make up the syntax of Kopi, which can be nested and combined to create larger structures. In addition to the many literal types, patterns are used for variable assignment, destructuring, and matching values.

### Operators

Let's start with some basic math. Kopi uses infix syntax for operators, with precedence rules similar to JavaScript and many other languages. Try editing the code to see different values.

```kopi
1 + 2 * 3 ^ 4
```

The (unedited) code above will be parsed as:

```
1 + (2 * (3 ^ 4))
```

There are other operators such as releational (`==` `!=` `>` `<` `<=` `>=`), logical (`&&` `||`), concatenation/merge (`++` `<<`) and conditional (`?:`) we'll cover later.

### Tuples

Tuples, which are values in parenthesis separated by commas or newlines, allow you to group multiple values together, and can be assigned to a variable or passed to functions.

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
ages = (20, 30)
("Joe", age: ages.1).age
```

### Assignment

Assignment is just a simple form of pattern matching, which we'll discuss later. It uses the `=` character to bind a value to a variable (or variables). Unlike scripting languages, each assignment creates a new scope instead of overwriting the variables's value. We'll cover this in a little more details when we get to functions.

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

### Functions

Kopi supports defining functions at the top level, and also supports anonymous functions, or closures that can be assigned to variables or passed to functions. Default arguments can be provided to be used when an empty value `()` is passed.

```kopi
square x = x * x
square 5
```

```kopi
square = (x = 10) => x * x
square ()
```

### Loops

Iteration can be either done by recursion, or by using the `let` and `loop` functions. Let is a function which simply applies the empty value `()` to its argument, a function which provides default arguments. `loop` is also just a function, which lets the `let` function know you want to do another iteration.

```kopi
let (n = 0) => {
  n < 5 ? loop (n + 1) : n
}
```
