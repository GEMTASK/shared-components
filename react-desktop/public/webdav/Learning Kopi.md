# Learning Kopi

## Introduction

Kopi is a small, immutable, 100% async programming language. It provides several literal types, uses patterns for destructuring and matching values, and supports lazy streams and coroutines.

Within this document, you can edit any code which has a value just below it and see the updated result.

### Small

Kopi is a small language, meanining it has a minimum of syntax. In fact, there are no keywords, just patterns and functions which take values. It doesn't take long to fully understand the language.

### Immutable

All values are immutable, which makes it much easier to understand what's happening in a program. State can be introduced by using loops, using recursion, or by using coroutines.

### 100% Asynchronous

Every expression in Kopi is asynchronous, so there's no need for `await` or similar concepts. This allows you to write async code that's easy to follow. Under the hood, all expressions are based on promises.

## Kopi Basics

### Literal Types

Common to most languages, Kopi has Number, String, and Boolean literal types. They are all represented internally as JavaScript primitives. We'll see later which operations are available on each, and what other literal types are available.

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
(123, "Two", (sleep 3))
```

Separating tuple fields by newlines allows you to write more complex expressions without having to use parenthesis. You'll see them heavily used in `match` expressions when passing multiple functions in a tuple.

```
(
  123
  "Two"
)
```

You can name tuple fields to make code easier to read and work with, and mix and match unnamed and named fields.

```
("Joe", 30)
(name: "Joe", age: 30)
("Joe", age: 30)
```

You can access tuple fields by index, or by name if one was provided.

```kopi
("Joe", age: (20, 30).1).age
```

Every value is actually a tuple (possibly a 1-tuple), so you if you expect a tuple as an argument, passing a number or string will work as expected.

```kopi
"Hello".0 == "Hello"
```

### Pattern Matching

Patterns are a key concept in Kopi, used for destructurng values in assignment and in function arguments, and for matching values in a `match` expression. The simplest pattern is matching on a single value:

```kopi
x = 2 + 3
x
```

You can use tuple patterns to perform multiple assignment, and nest patterns arbitrarily to extract values. Patterns have a duality with literal types, mirroring thier syntax.

```kopi
(a, [b, c]) = (1, [2, 3])
(a, b, c)
```

Patterns are often used for matching. The `match` function takes a value as its first curried argument, and a tuple of functions for its second argument. Each function's parameter pattern is tested against the value, and if the match is successfull, that function is called and the return value is used as the return value for match.

The `_` character can be used as a parameter to represent "I don't care what the value is".

```kopi
match (1, 3) (
  (1, b) => "1 and " ++ String b
  _      => "Unknown"
)
```

### Functions

Functions are called with a space between the function name and it's argument. Multiple arguments can be either curried, or passed as a tuple, possibly with named fields. Tuples with named fields affords great readability, while curried functions are often used to simulate keywords, such as with the `match` function.

```kopi
random 1.5..3
```

Functions can be defined using patterns, or created anonymously, as in `(a, b) => a + b` to be stored in variables or to be passed as arguments to functions. Here, we're using the tuple pattern `(a, b)` to be able to pass multiple values.

```kopi
add (a, b) = a + b
add (2, 3)
```

You can use curly braces to introduce a block, which allows you to write multiple statements in a function or simply reduce the function's width. The last expression in the block is the value returned.

```
add (a, b) = {
  a + b
}
```

Default arguments can be provided, which are used when the empty value `()` is given. They are commonly used in the `let` function used for looping, and in collection methods such as `reduce` and `update`.

```kopi
add (a, b = 3) = a + b
add 2
```

### Methods

Kopi types support polymorphism through the use of methods, but methods are defined externally and are scoped just like functions. Methods are invoked by using the `|` pipe operator, and can be chained.

```kopi
(10 + 20) | cos | toFixed 3
```

The `|` pipe operator can start on a new line, so that longer chains are easier to read:

```
(10 + 20)
  | cos
  | toFixed 3
```

An alternative to invoking a method is by using `'method` or `'(method arg)` syntax, which is an ASTree literal type we'll talk about later. It's simply a way to call a method just like a function, and is often used to pass to methods that take a function, such as `map` and `filter`.

```kopi
"abc" | map 'succ
```

The above syntax is short for:

```
"abc" | map (c) => (c | succ)
```

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

Also common to many languages, Kopi has Array and Dictionary literal types, and each has a mirror pattern which can be used to extract and match values.

```kopi
[1, 2, 3].size
```

Matching on an array pattern:

```kopi
[a, b] = [1, 2, 3]
(a, b)
```


## Advanced Topics

### Asynchronous
### Function Predicates
### Coroutines
### User Defined Types

You can define your own types in Kopi, which look and behave just like native types.

```kopi
Point = struct (x: Number, y: Number)

extend Point (
  +: (that) => Point (this.0 + that.0, this.1 + that.1)
)

Point (1, 2) + Point (2, 3)
```

## Examples

### Grayscale Convertion

```kopi
grayscale (color) = {
  let ([r, g, b] = color) =>
    (r * 0.3 + g * 0.6 + b * 0.1) / 3
}

grayscale [255, 128, 255]
```

### Building a Dictionary

```kopi
[1..3, 4..6]
  | zip
  | reduce (z = {}, (a, b)) => {
      z << { [a, b]: a * b }
    }
```

### Reading a JSON String

```kopi
Any.fromJsonString "
  {
    \"name\": \"Joe\",
    \"ids\": [1, 2, 3],
    \"shared\": true
  }
"
```

### Word Count

```kopi
"abcaba" | reduce (counts = {}, letter) => {
  counts | update letter (count = 0) => count + 1
}
```

### FizzBuzz

```kopi
1..15 | map (n) => {
  match (n % 3, n % 5) (
    (0, 0) => "FizzBuzz"
    (0, _) => "Fizz"
    (_, 0) => "Buzz"
    _      => n
  )
}
```

### Dynamic Pipelining

```kopi
let (fns = [
  '(map n => n * n)
  '(filter 'even)
]) => {
  fns | reduce (x = 1..10, f) => f x
}
```

### Various Factorials

```kopi
factorial (n) = 1..n | reduce (a, n) => a * n

factorial 5
```

```kopi
factorial (n) = match n (
  0 => 1
  n => n * factorial (n - 1)
)

factorial 5
```

```kopi
factorial (n) = {
  let (n = n, a = 1) => match n (
    0 => a
    n => loop (n - 1, a * n)
  )
}

factorial 5
```

### Extending String

```kopi
extend String (
  capitalize: () => {
    'toUpper this.(0..1) ++ this.(1..1000)
  }
)

"hello" | capitalize
```

### Coroutines

```kopi
server (yield) = {
  let (a = 0) => {
    yield (b) => {
      sleep (random 0.1..1.0)
      a..b
    }

    loop (a + 1)
  }
}

coros = [
  spawn server
  spawn server
]

let (n = 1) => {
  data = coros | map (coro) => {
    coro | send n
  }

  values = data
    | zip (a, b) => a * b
    | map '(toFixed 1)

  # print values

  n < 6 ? loop (n + 2) : "Done."
}
```

### BASIC Interpreter

```kopi
program = "
  10 print 'hello'
  20 goto 30
  30 print 'world'
"

indexOf (lineNo) = {
  (Number.fromString lineNo) / 10 - 1
}

next = (index) => index + 1
goto (index) = () => index

evaluate (line) = match (
  line
    | trim
    | splitOn " "
) (
  [lineNo, "print", value] => {
    # print value
    next
  }
  [lineNo, "goto", gotoNo] => {
    goto (indexOf gotoNo)
  }
)

interpret (program) = {
  lines = program
    | trim
    | splitOn String.newline

  let (index = 0) => {
    reducer = evaluate lines.(index)
    newIndex = reducer index

    newIndex < lines.size ? {
      loop (newIndex)
    } : {
      "Done."
    }
  }
}

interpret program
```
