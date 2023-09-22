type Reference = {
  title: string, content: {
    code: string, label?: string, extra?: string;
  }[];
};

const reference: Reference[] = [
  {
    title: 'Basic Syntax', content: [
      { code: `(1 + 2) ^ 3`, label: 'Basic arithmetic' },
      { code: `str = "Hello"`, label: 'Basic assignment' },
      { code: `[a, b] = "ab"`, label: 'Pattern matching' },
      { code: `"ab" == "ab"`, label: 'Equality operator' },
      { code: `"ab" != "ab"`, label: 'Equality operator' },
      { code: `<  <=  >  >=`, label: 'Relational operators' },
      { code: `(a && b) || c`, label: 'Logical operators' },
      { code: `"ab" ++ "cd"`, label: 'Concat operator' },
      { code: `a << { y: 2 }`, label: 'Dict merge operator' },
      { code: `print "Hello"`, label: 'Function application' },
      { code: `f (x) = x * x`, label: 'Function definition' },
      { code: `(x) => x * x`, label: 'Anonymous function' },
      { code: `5 | toFixed 2`, label: 'Method invocation' },
      { code: `'(toFixed 2) 5`, label: 'Alternate invocation' },
      { code: `(1, y: 2).1`, label: 'Tuple index access' },
      { code: `(1, y: 2).y`, label: 'Tuple field access' },
      { code: `array.(3)`, label: 'Array index access' },
      { code: `array.(1..5)`, label: 'Array slice access' },
      { code: `x < 0 ? -x : x`, label: 'Condition expression' },
      { code: `{ a <nl> b }`, label: 'Multiple statements' },
    ]
  },
  {
    title: 'Basic Types', content: [
      { code: `1  -2.5  3.14`, label: 'Number', extra: `1 => "One"` },
      { code: `"Hello, world"`, label: 'String', extra: `"One" => 1` },
      { code: `true  false`, label: 'Boolean', extra: `true => 2` },
      { code: `'ident  '(+ 1)`, label: 'ASTree', extra: `'foo => 3` },
      { code: `1..5  "a".."z"`, label: 'Range', extra: `1..5 => "5"` },
      { code: `(1, y: "abc")`, label: 'Tuple', extra: `(1, x) => x` },
      { code: `[1, 2, 3, 4]`, label: 'Array', extra: `[2, y] => y` },
      { code: `{ x: 1, y: 2 }`, label: 'Dict', extra: `{x: x} => x` },
    ]
  },
  {
    title: 'Core Functions', content: [
      {
        code: `sleep 0.5`,
      },
      {
        code: `random 0.5..1.5`
      },
      {
        code: `fetch "/robots.txt"`
      },
      {
        code: `
let (n = 0) => {
  n < 5 ? loop (n + 1) : n
}
      `,
      },
      {
        code: `
match expr (
  (1, [a, b]) => a + b
)
`
      },
      {
        code: `
extend String (
  foo: () => this + "foo"
)
`
      },
      {
        code: `
spawn () => {
  yield (x) => x + 1
}
`
      },
    ]
  },
  {
    title: 'Number Methods', content: [
      { code: '3 + 2   3 - 2', extra: '5   1' },
      { code: '3 * 2   3 / 2', extra: '6   1.5' },
      { code: '3 ^ 2   3 % 2', extra: '9   1' },
      { code: '2 == 2   1 != 2', extra: 'true' },
      { code: '3 > 2   2 < 3', extra: 'true' },
      { code: '2 >= 2   3 <= 3', extra: 'true' },
      { code: '2.5 | floor', extra: '2' },
      { code: '2.5 | round', extra: '3' },
      { code: '2.5 | ceil', extra: '3' },
      { code: '-2 | abs', extra: '2' },
      { code: '4 | sqrt', extra: '2' },
      { code: '1 | succ 2', extra: '3' },
      { code: '1.5 | toFixed 2', extra: '1.50' },
      { code: '3 | odd', extra: 'true' },
      { code: '3 | even', extra: 'false' },
      { code: '30 | sin', extra: '-0.988' },
      { code: '30 | cos', extra: '0.154' },
    ]
  },
  {
    title: 'String Methods', content: [
      { code: '"ab" ++ "bc"', extra: '"abbc"' },
      { code: '"ab" == "ab"', extra: 'true' },
      { code: '"abc".(1)', extra: '"b"' },
      { code: '"abc" | toUpper', extra: '"ABC"' },
      { code: '" abc " | trim', extra: '"abc"' },
      { code: '"abc" | size', extra: '3' },
      { code: '"" | empty', extra: 'true' },
      { code: '"a" | succ 2', extra: '"c"' },
      { code: '"a,b" | splitOn ","', extra: '["a", "b"]' },
      { code: '"ab" | splitAt 1', extra: '["a", "b"]' },
      { code: '"abc" | splitEvery 2', extra: '["ab", "c"]' },
    ]
  },
  {
    title: 'Boolean Methods', content: [
      { code: '!true', extra: 'false' },
      { code: 'true == true', extra: 'true' },
      { code: 'true != true', extra: 'false' },
    ]
  },
  {
    title: 'Range Methods', content: [
      { code: '(1..5).from', extra: '1' },
      { code: '(1..5).to', extra: '5' },
      { code: '(1..5 (by: 2)).stride', extra: '2' },
      { code: '...Iterable Methods' },
    ]
  },
  {
    title: 'Array Methods', content: [
      { code: '[1, 2] ++ [3, 4]', extra: '[1, 2, 3]' },
      { code: '[1, 2] == [1, 2]', extra: 'true' },
      { code: '[1, 2].(1)', extra: '2' },
      { code: '[1, 2] | size', extra: '2' },
      { code: '[] | empty', extra: 'true' },
      { code: '[1..1, "a".."z"] | zip', extra: '[(1, "a")]' },
      { code: '...Iterable Methods' },
    ]
  },
  {
    title: 'Iterable Methods', content: [
      {
        code: `2..4 | map (n)
  => n^2`, extra: '[4, 9, 16]'
      },
      {
        code: `
2..3 | flatMap (n)
  => [n, n]
`,
        extra: '[2, 2, 3, 3]'
      },
      {
        code: `1..5 | filter (n)
  => n % 2 == 0`, extra: '[1, 3, 5]'
      },
      {
        code: `
1..5 | reduce (a, n)
  => a * n
`,
        extra: '120'
      },
      {
        code: `1..5 | count (n)
  => n > 2`, extra: '3'
      },
      { code: '1..5 | take 3', extra: '[1, 2, 3]' },
      { code: '1..5 | skip 3', extra: '[4, 5]' },
      { code: '1..2 | repeat', extra: '[1, 2, 1...]' },
      { code: '1..2 | join ", "', extra: '"1, 2"' },
      { code: `1..4 | splitOn 2`, extra: '[[1], [3, 4]]' },
      { code: `1..3 | splitAt 1`, extra: '[[1], [2, 3]]' },
      { code: `1..3 | splitEvery 2`, extra: '[[1, 2], [3]]' },
    ]
  },
  {
    title: 'User Defined Types', content: [
      {
        code: `
Point = struct (
  x: Number
  y: Number
)
extend Point (
  +: (that) => Point(
    this.0 + that.0
    this.1 + that.1
  )
)
Point (1, 2) + Point (2, 3)
        `
      },
    ]
  },
];

export default reference;
