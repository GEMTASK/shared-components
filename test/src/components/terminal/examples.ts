const examples = [
  `date`,
  `clock`,
  `calendar`,
  `1 + 2 * -3`,
  `(1 + 2) * -3`,
  `(!true, !false)`,
  `random 4.5..5.5`,
  `sleep 5 + sleep 5`,
  `("a", "b", "c").1`,
  `(foo: 1, bar: 2).bar`,
  `"abc" ++ "def"`,
  `[1, 2] ++ [3, 4]`,
  `((), true, false, 1, 'ast, "3", [])`,
  `"ab" ++ 2 < 3 ? "cd" : "ef"`,
  `
(a, b, c) = (1, 2, 3)
(a == 1, b == 2)
  `,
  `
[a, b, c] = "abc"
(a == "a", b == "b")
  `,
  `(a => b => a + b) 1 2`,
  `((a, b) => a + b) (1, 2)`,
  `((a, b = 2) => a + b) 1`,
  // `1..3 | flatMap a => ((a + 1)..3 | map b => (a, b))`,
  `((a = 1, b = 2) => a + b) ()`,
  `let (a = 1) => a`,
  `let (a = 1, b = 2) => a + b`,
  `('1, 'sin, '(sin 30))`,
  `'sin (30 * (PI / 180))`,
  `'cos (30 * (PI / 180))`,
  `fetch "robots.txt"`,
  `'size (fetch "robots.txt")`,
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
  `[(1..5).from, (1..5).to]`,
  `"a".."z" (5) | map 'toUpper`,
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
  `0..0.5 (0.1) | map '(toFixed 1)`,
  `(1 == 1, "a" == "a", 'b == 'b)`,
  `(1, "a", 'b) == (1, "a", 'b)`,
  `[1, "a", 'b] == [1, "a", 'b]`,
  `[1, 2, 3] == 'toArray 1..3`,
  `
fns = ['(map n => n * n)]
fns | reduce (x = 1..5, f) => f x
  `,
  `1..3 | combos`,
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
coro = spawn () => {
    let (x = 1) => {
        yield n => n + x
        loop (x + 1)
    }
}
[coro | send 5, coro | send 5]
  `,
  `
Person = struct (name: String)
p = Person (name: "Joe")
(p, p.name)
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
];

export default examples;
