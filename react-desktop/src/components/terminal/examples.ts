const examples = [
  `date`,
  `clock`,
  `calendar`,
  `(1 + 2) * 3 + (4 ^ 2)`,
  `(1, "3", true, 'ast, (), [], {})`,
  `!true == !!false`,
  `(2 > 1 && 3 > 2) || false`,
  `2 > 1 || (2 > 3 && false)`,
  `
let (t = true, f = false) => {
  (!t && !f) == !(t || f)
}`,
  `random 4.5..5.5`,
  `sleep 5 + sleep 5`,
  `("a", "b", "c").1`,
  `(foo: 1, bar: 2).bar`,
  `"abc" ++ "def"`,
  `[1, 2] ++ [3, 4]`,
  `"ab" ++ (2 < 3 ? "cd" : "ef")`,
  `
(a, b, c) = (1, 2, 3)
(a, b, c) == (1, 2, 3)
  `,
  `
[a, b] ++ c = "ab" ++ "cd"
(a, b, c) == ("a", "b", ["c", "d"])
  `,
  `
f a b = (a, b)
(f 2 3) == (2, 3)
  `,
  `
(:y, :x) = (x: 1, y: 2)
(x, y) == (1, 2)
  `,
  `
grayscale (color) = {
  let ([r, g, b] = color) =>
    (r * 0.3 + g * 0.6 + b * 0.1) / 3
}
grayscale [255, 128, 255]
  `,
  `(a => b => a + b) 1 2`,
  `((a, b) => a + b) (1, 2)`,
  `((a, b = 2) => a + b) 1`,
  // `1..3 | flatMap a => ((a + 1)..3 | map b => (a, b))`,
  `((a = 1, b = 2) => a + b) ()`,
  `let (a = 1) => a`,
  `let (a = 1, b = 2) => a + b`,
  `'sin (30 * (PI / 180))`,
  `fetch "robots.txt"`,
  `(fetch "robots.txt").size`,
  `
add1 (n) = n + 1
add1 5
  `,
  `"abc" | map (c) => 'toUpper c`,
  `"🥥🍏🍓" | map 'succ`,
  `"🥥🍏🍓" | at 1`,
  `"abc" | split | map 'succ`,
  `"a,b,c" | split ","`,
  `("ab", "xy") | map (a, x) => a x`,
  `let (r = 1..5) => (r.from, r.to)`,
  `"a".."z" (by: 5) | map 'toUpper`,
  `"a".."e" | count () => true`,
  `1..5 | take 3 | map (n) => n * n`,
  `1..(fetch "robots.txt" | size)`,
  `1..5 | take 3 | map '(toFixed 2)`,
  `1..10 | filter (n) => n % 2 == 0`,
  `", " | combine 1..3`,
  `1..3 | join ", "`,
  `", " | combine "abc"`,
  `"abc" | join ", "`,
  `1..3 | map '(toFixed 2) | join ", "`,
  `1..5 | reduce (a = 1, n) => a * n`,
  `"abc" | reduce (a, c) => a ", " c`,
  `[sleep 5, sleep 5]`,
  `[1, "two", 1..3, n => n * n]`,
  `[1, 2, 3] | at 1`,
  `([1, 2, 3] | at 0..2) == [1, 2]`,
  `[1, 2] | reduce (a, n) => a + n`,
  `[1, 2, 3] | take 2 | take 1`,
  `(1..2, 3..4) | map (a, b) => a * b`,
  `1..3 | repeat | take 7`,
  `0..0.31 (by: 0.1) | map '(toFixed 1)`,
  `(1 == 1, "a" == "a", 'b == 'b)`,
  `(1, "a", 'b) == (1, "a", 'b)`,
  `[1, "a", 'b] == [1, "a", 'b]`,
  `[1, 2, 3] == 'toArray 1..3`,
  `
let (fns = [
  '(map n => n * n)
  '(filter 'even)
]) => {
  fns
    | reduce (x = 1..10, f) => f x
}
  `,
  `1..1000000 | combos | take 3`,
  `
1..4 | combos | map (a, b) => {
  a * b
}
  `,
  `"abc" | combos`,
  `[1, 2, 3] | combos`,
  `1..3 | some n => n == 2`,
  `"abc" | some c => c == "b"`,
  `['a, 'b, 'c] | some c => c == 'b`,
  `"aaa" | every c => c == "a"`,
  `['a, 'a, 'a] | every c => c == 'a`,
  `1..3 | find (n) => n == 2`,
  `[1, 2, 3] | find (n) => n == 2`,
  `"abc" | find (c) => c == "b"`,
  `1..5 | count (n) => 'even n`,
  `[1, 2, 3] | count (n) => 'even n`,
  `"abc" | count (c) => c == "b"`,
  `1..5 | map '(* 3) | count 'even`,
  `1..3 | includes 2`,
  `"abc" | includes "b"`,
  `[1, 2, 3] | includes 2`,
  `1..10 | splitOn 3`,
  `"aa,b,cc" | splitOn ","`,
  `[1, 1, 0, 2, 0, 3, 3] | splitOn 0`,
  `1..10 | splitEvery 3`,
  `"abcdefghij" | splitEvery 3`,
  `[1, 2, 3] | splitEvery 2`,
  `
age = context 30
age | get
age | set 10
age | get
  `,
  `
1..15 | map (n) => {
  match (n % 3, n % 5) (
    (0, 0) => "FizzBuzz"
    (0, _) => "Fizz"
    (_, 0) => "Buzz"
    _      => n
  )
}
  `,
  `
fact (n) = match n (
  0 => 1
  n => n * fact (n - 1)
)
fact 5
  `,
  `
fact (n) = let (n = n, a = 1) => {
  match n (
    0 => a
    n => loop (n - 1, a * n)
  )
}
[fact 5, fact 6, fact 7]
  `,
  `
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

  print values

  n < 6 ? loop (n + 2) : "Done."
}
  `,
  `
extend String (
  foobar: () => {
    this ++ "bar"
  }
)
"foo" | foobar
  `,
  `
Point = struct (
  x: Number
  y: Number
)
extend Point (
  +: (that) => {
    Point(
      this.0 + that.0
      this.1 + that.1
    )
  }
)
Point (1, 2) + Point (2, 3)
  `,
  `
View (
  horizontal: true
  fillColor: "gray-1"
  padding: "large"
) [
  Text (
    fillColor: "green-3"
    padding: "small large"
    align: "center"
  ) "Hello, world"
  Button (
    solid: true
    title: "blue-5"
  )
]
  `,
  `
Hello = component (setState) => {
  handleClick () = {
    setState (state = 0) => state + 1
  }

  (state = 0) => {
    Text (
      padding: "small"
      fillColor: "green-1"
      onClick: handleClick
    ) ("Counter: " ++ String state)
  }
}

Hello () []
  `,
  `
Goodbye = component () => () => {
  Text () "Goodbye"
}
Goodbye () []
  `,
  `
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
    print value
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
    reducer = evaluate (
      lines.(index)
    )
    newIndex = reducer index

    newIndex < lines.size ? {
      loop (newIndex)
    } : "Done."
  }
}

interpret program
  `,
  `
match 5 (
  String s => "String " ++ s
  Number n => "Number " ++ String n
)
  `,
  `
Any.fromJsonString "
  {
    \\"name\\": \\"Joe\\",
    \\"ids\\": [1, 2, 3],
    \\"shared\\": true
  }
"
  `,
  `
a = Dict.fromIterable [
  ("1", 1)
]
b = Dict.fromIterable [
  ("1", 100)
  ("2", 200)
  ("3", 300)
]
c = Dict.fromIterable [
  ("3", 3)
]
a << b << c
  `,
  `
[1..3, 4..6]
  | zip
  | reduce (z = {}, (a, b)) => {
      z << { [a, b]: a * b }
    }
  `,
  `
inspect (object) = match object (
  Array array => {
    items = array | map (item) => {
      inspect item
    }
    "[" ++ (items | join ", ") ++ "]"
  }
  Number number => String number
  String string => {
    "\\"" ++ string ++ "\\""
  }
)
inspect [1, "2", 3]
  `,
  `
1..5 | map (n) => match n (
  _ [n > 3] => "n > 3"
  _ [n > 1] => "n > 1"
  _         => "n"
)
  `,
  `
ls
  `,
  `
ls 'l "Scripts"
  `,
  `
cat "Scripts/hello.kopi"
  `,
  `
(:hello) = import "Scripts/hello.kopi"
hello "Joe"
  `,
  `
(:Vector) = import "Scripts/Vector.js"
Vector [1, 2, 3] + Vector [2, 3, 5]
  `,
  `
{
  extend String (
    size: () => {
      ('size this) + 10
    }
  )
  print ('size "hello" == 15)
}
print ('size "hello" == 5)
  `,
  `
{ 1: "One", 2: "Two" }
  | reduce (z = {}, (k, v)) => {
      z << { (v): k }
    }
  `,
];

export default examples;
