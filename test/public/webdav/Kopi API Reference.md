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
| `+` `n`            | Addition |
| `-` `n`            | Subtraction |
| `*` `n`            | Multiplication |
| `/` `n`            | Division |
| `%` `n`            | Remainer |
| `^` `n`            | Exponent |
|                    |
| `==` `n`           | Tests if is equal to the argument |
| `!=` `n`           | Tests if not equal to the argument |
| `<` `n`            | Compares less than the argument |
| `<=` `n`           | Compares less than or equal to the argument |
| `>` `n`            | Compares greater than the argument |
| `>=` `n`           | Compares greater than or equal to the argument |
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
| `==` `b`           | Tests if is equal to the argument |
| `!=` `b`           | Tests if not equal to the argument |
| `!`                | Logical complement, negation |
| `succ`             | If `false`, returns `true`, else `()` |

### String

| Field / Method     | Description |
| ------------------ | ----------- |
| `.size`            | The number of characters in the string |
|                    |
| `==` `s`           | Tests if is equal to the argument |
| `!=` `s`           | Tests if not equal to the argument |
| `<` `s`            | Compares less than the argument |
| `<=` `s`           | Compares less than or equal to the argument |
| `>` `s`            | Compares greater than the argument |
| `>=` `s`           | Compares greater than or equal to the argument |
|                    |
| `toString`         | Returns itself |
| `empty`            | Tests if the string is empty (size == 0) |
| `toUpper`          | Converts all characters to upper-case |
| `tirm`             | Removes leading and trailing whitespace |
| `Iterable.*`       | String supports all the Iterable methods |

### Array

| Static Method      | Description |
| ------------------ | ----------- |
| `fromIterable`     | |

| Field / Method     | Description |
| ------------------ | ----------- |
| `.size`            | The number of elements in the array |
| `.(i)`             | |
|                    |
| `==` `a`           | Tests if is equal to the argument |
| `!=` `a`           | Tests if not equal to the argument |
| `++` `a`           | Concatenate the array with another |
|                    |
| `toString`         | The string representation of the array |
| `at` `i`           | |
| `empty`            | Tests if the array is empty (size == 0) |
| `zip` `[f]`        | |
|                    |
| `Iterable.*`       | Array supports all the Iterable methods |

### Range

| Field / Method     | Description |
| ------------------ | ----------- |
| `.from`            | The lower bound of the range, inclusive |
| `.to`              | The upper bound of the range, inclusive |
|                    |
| `toString`         | The string representation of the range |
| `(by: n)`          | Sets the stride of the range |
|                    |
| `Iterable.*`       | Range supports all the Iterable methods |

### Tuple

| Field / Method     | Description |
| ------------------ | ----------- |
| `.n`               | The n'th field of the tuple, or an error if out of range |
| `.field`           | The field by name, or an error if not found |
| `==` `t`           | Tests if is equal to the argument |
| `!=` `t`           | Tests if not equal to the argument |

### Dict

| Static Method      | Description |
| ------------------ | ----------- |
| `fromIterable`     | |

| Field / Method     | Description |
| ------------------ | ----------- |
| `.size`            | The number of entries in the dictionary |
|                    |
| `<<` `d`           | Merge the dictionary with another |
|                    |
| `toString`         | The string representation of the array |
| `at` `k`           | |
| `update` `k` `f`   | |
|                    |
| `Iterable.*`       | Dict supports all the Iterable methods |

### Iterable

| Field / Method     | Description |
| ------------------ | ----------- |
| `map` `f`          | Iterates over and transforms each element |
| `flatMap` `f`      | Iterates over and transforms each element, flattening each nested array |
