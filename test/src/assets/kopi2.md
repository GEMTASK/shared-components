# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It supports several literal types, and has pattern matching, lazy streams, and coroutines.

## Kopi Basics

Kopi has a handful of syntax rules which can be nested and combined to create larger structures. Patterns are used for assignment, destructuring and matching values. In this document, you can edit the Kopi code and see the result just below the code.

### Numbers and Math

Infix math operators are supported such as add, subtract, multiply, divide, remainer, and exponent. Operator precedence is similar to other languages where multiplication is more tighly bound that addition for example.

```
1 + 2 * 3 ^ 4
```

would be parsed as

```
1 + (2 * (3 ^ 4))
```

### Tuples and Arrays

A **Tuple** is a fixed structure with any number of types.  There is a special value 0-tuple, which is used to represent "no value".

```
(1, "Two", false)
```

You can name tuple fields to make code easier to read and work with, and mix and match non-named and named fields.

```
(name: "Joe", age: 30)
```

Every type can be represented as a 1-tuple with a .0 field index, which comes in handy when using function default arguments.

```kopi
"foo".0
```

An **Array** is a 0-based indexed collection of the same or similar types.

```
[1, 2, 3]   ["a", "b", "c"]
```

Tuple fields and array elements can be separated by commas, or by newlines. This comes in handy when defining large structures as we'll see later.

```
(
  names: [
    "Joe"
    "Sally"
  ]
  vertices: [
    (1, 2)
    (3, 4)
  ]
)
```

## Patterns

Patterns can be used for simple assignment, or to destructure complex values. They can be used in function parameters, and to match values.

### Basic Assignment

A very simple "identifier" pattern, which assigns the value 1 to variabled "a":

```kopi
a = 1
a
```

A pattern that swaps its arguments:

```kopi
a = 1
b = 2
(a, b) = (b, a)
(a, b)
```

### More Complex Patterns

Here's a more complex pattern, where we've destructured the tuple/array values into the variables "a", "b", and "c":

```
(a, [b, c]) = (1, [2, 3])
```

You also use patterns to define functions and to match values. Here, match is a function which takes a value and a tuple of functions. Each function parameter pattern is tested with the value, and if a match is found, that function is called.

```kopi
factorial (n) = match n (
  0 => 1
  n => n * factorial (n - 1)
)

factorial 5
```

## Functions

### Argument Patterns
### Default Arguments

Default arguments allow you to add expressions to each parameter, which are used if no value (the empty tuple) is given.

```kopi
((a, b = 2) => a + b) 5
```

### Function Predicates

## Loops

```kopi
let (n = 0) => {
  n < 5 ? loop (n + 1) : n
}
```

## Lazy Streams
