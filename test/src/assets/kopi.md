# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It provides several literal types, uses patterns for destructuring and matching values, and supports lazy streams and coroutines.

### Small

Kopi is a small language, meanining it has a minimum of syntax. In fact, there are no keywords, just patterns and functions which take values.

### Immutable

All value are immutable, which makes it much easier to understand what's happening in a program. State can be create using loops and recursion.

### 100% async

Every expression in Kopi is asynchronous, so there's no need for `await` or similar paterns. This allows you to write code that is easy to follow.

## Kopi Basics

### Literal Types

Common to most languages, Kopi has Number, String, and Boolean literal types. They are all represented internally as JavaScript primitives. We'll see later which operations are available on each.

```
1, -2.5, 3.14       Number        A floating point or integer value
"Hello, world"      String        A string of Unicode characters
true, false         Boolean       A boolean value true or false
```

### Math and Logic

Let's start with some basic math. Kopi uses infix syntax for operators, with precedence rules similar to JavaScript and many other languages. Try changing the values below to see the result change.

```kopi
7 + 6 * 5 - 4 ^ 3 % 2
```

Based on operator precedence, the above will be parsed as:

```
(7 + (6 * 5)) - ((4 ^ 3) % 2)
```

Operators for equality (`==` `!=`), releational (`>` `<` `<=` `>=`), and logical (`&&` `||`) are similar to JavaScript, except that all values that support equality are comparable by value. There are no reference types.

```kopi
3 > 2 && "a" < "b" == true
```

### Tuples

Tuples allow you to store multiple values in one variable, or to pass multiple values to functions, and are a key concept in Kopi. They are defined by values separated by commas or newlines, surrounded by parenthesis.

```
(1, "Two", (sleep 3))
```

Separating tuple fields by newlines allows you to write more complex expressions without having to use parenthesis. You'll see them heavily used in `match` expressions where passing multiple functions in a tuple.

```
(
  1
  "Two"
)
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

### Pattern Matching

Patterns are a key concept in Kopi, used for destructurng values in assignment and in function arguments, and for matching values in a `match` expression. The simplest pattern is matching on a single value:

```kopi
x = 1
x
```

You can use tuple patterns to perform multiple assignment, and nest patterns arbitrarily to extract values. Patterns have a duality with literal types, mirroring thier syntax.

```kopi
(a, [b, c]) = (1, [2, 3])
(a, b, c)
```

Patterns are often use for matching, which also does destructured assignment. The `_` character can be used as a parameter to represent "I don't care what the value is".

```kopi
match (1, 3) (
  (1, b) => "1 and " ++ String b
  _      => "Unknown"
)
```

### Functions

Functions are called with a space between the function name and it's argument. Multiple arguments can be either curried, or passed as a tuple, possibly with named fields. Tuples with named fields provides great readability, while curried functions are often used to simulate keywords, such as the `match` function.

```kopi
random 1.5..3
```

Functions can be defined using patterns, or or created anonymously to be stored in variables or to be passed to functions.

```kopi
add (a, b) = a + b
add (2, 3)
```

You can use curly braces to introduce a block, which allows you to write multiple statements in a function. The last expression in the block is the return value.

```kopi
add (a, b) = {
  a + b
}
add (2, 3)
```

Default arguments can be provided which are applied when an empty value `()` is passed.

```kopi
add (a, b = 3) = a + b
add 2
```

### Methods

### Conditions and Looping

Iteration can be either done via recursion, or by using the `let` and `loop` functions. `let` is a function which applies the empty value `()` to its argument, a function. `loop` is also a function, which instructs the `let` function to do another iteration.

```
let (a = 1) => {
  loop (a + 1)
}
```

That code will loop forever, so we need some way to call loop conditionally. That can be done with the `?:` conditional operator similar to JavaScript.

```kopi
let (a = 1) => {
  a < 5 ? loop (a + 1) : a
}
```

### Arrays and Dicts

## Advanced Topics

### Asyncronous Code
### Coroutines
### User Defined Types
