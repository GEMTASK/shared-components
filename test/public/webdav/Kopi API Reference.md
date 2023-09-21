# Kopi API Reference

## Common Methods

### Stringable

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `toString`         | ✓       | ✓      | ✓      | ✓     | ✓    | ✓     | ✓      | ✓     |        |          |

### Equatable

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `==`               | ✓       | ✓      | ✓      | ✓     | ✓    | ✓     | ✓      | ✓     |        |          |

### Comparable

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `<`                | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `<=`               | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `>`                | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `>=`               | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |

### Enumerable

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `succ`             | ✓       | ✓      | ✓      |       |      |       |        |       |        |          |

### Iterable

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `map`              |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `flatMap`          |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `filter`           |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `reduce`           |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |

| Field / Method     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| ------------------ | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `splitOn`          |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |
| `splitAt`          |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |
| `splitEvery`       |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |

## Methods by Type

### Number

| Field / Method     | Description |
| ------------------ | ----------- |
| `toString`         | The string representation of the number |
|                    |
| `+`                | Addition |
| `-`                | Subtraction |
| `*`                | Multiplication |
| `/`                | Division |
| `%`                | Remainer |
| `^`                | Exponent |
|                    |
| `==`               | Tests if is equal to the argument |
| `!=`               | Tests if not equal to the argument |
| `<`                | Compares less than the argument |
| `<=`               | Compares less than or equal to the argument |
| `>`                | Compares greater than the argument |
| `>=`               | Compares greater than or equal to the argument |
|                    |
| `abs`              | The absolute value of the number |
| `floor`            | The largest integer less than or equal to the number |
| `round`            | The number rounded to the nearest integer |
| `ceil`             | The smallest integer greater that or equal to the number |
| `sqrt`             | The square root of the number |
|                    |
| `sin`              | The sine of the number in radians |
| `cos`              | The cosine of the number in radians |
|                    |
| `succ` `n = 1`     | The number + `n`, or `1` if not provided |
| `toFixed` `n`      | Formats the number using fixed-point notation |

### Boolean

| Field / Method     | Description |
| ------------------ | ----------- |
| `toString`         | The string representation of the boolean |
| `==`               | Tests if is equal to the argument |
| `!=`               | Tests if not equal to the argument |
| `!`                | Logical complement, negation |
| `succ` `n`         | If `false`, returns `true`, else `()` |

### String

| Field / Method     | Description |
| ------------------ | ----------- |
| `.size`            | The number of characters in the string |
|                    |
| `==`               | Tests if is equal to the argument |
| `!=`               | Tests if not equal to the argument |
| `<`                | Compares less than the argument |
| `<=`               | Compares less than or equal to the argument |
| `>`                | Compares greater than the argument |
| `>=`               | Compares greater than or equal to the argument |
|                    |
| `toString`         | Returns itself |
| `empty`            | Tests if the string is empty (size == 0) |
| `toUpper`          | Converts all characters to upper-case |
| `tirm`             | Removes leading and trailing whitespace |
| `Iterable.*`       |

### Array

| Static Method      | Description |
| ------------------ | ----------- |
| `fromIterable`     | |

| Field / Method     | Description |
| ------------------ | ----------- |
| `.size`            | The number of elements in the array |
| `.(index)`         | |
|                    |
| `==`               | Tests if is equal to the argument |
| `!=`               | Tests if not equal to the argument |
| `++`               | Concatenation |
|                    |
| `toString`         | The string representation of the array |
| `at`               | |
| `empty`            | Tests if the array is empty (size == 0) |
| `zip`              | |
|                    |
| `Iterable.*`       | |
