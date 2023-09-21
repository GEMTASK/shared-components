# Kopi API Reference

## Common Functionality

### Stringable

| **Method**     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `toString`     | ✓       | ✓      | ✓      | ✓     | ✓    | ✓     | ✓      | ✓     |        |          |

### Equabile

| **Method**    | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `==`           | ✓       | ✓      | ✓      | ✓     | ✓    | ✓     | ✓      | ✓     |        |          |

### Comparable

| **Method**  | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `<`            | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `<=`           | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `>`            | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |
| `>=`           | ✓       | ✓      | ✓      | ?     |      |       |        |       |        |          |

### Enumerable

| **Method**  | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `succ`         | ✓       | ✓      | ✓      |       |      |       |        |       |        |          |

### Iterable

| **Method**     | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `map`          |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `flatMap`      |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `filter`       |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |
| `reduce`       |         |        | ✓      | ✓     | ✓    | ✓     |        |       | ✓      |          |

| **Methods**    | Boolean | Number | String | Array | Dict | Range | ASTree | Tuple | Stream | Function |
| -------------- | :-----: | :----: | :----: | :---: | :--: | :---: | :----: | :---: | :----: | :------: |
| `splitOn`      |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |
| `splitAt`      |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |
| `splitEvery`   |         |        | ✓      | ✓     |      | ✓     |        |       | ✓      |          |

## Methods by Type

### Number

| **Method**     | Description |
| -------------- | ----------- |
| `toString`     | |
| `==`           | |
| `!=`           | |
| `<`            | |
| `<=`           | |
| `>`            | |
| `>=`           | |
| `abs`          | |
| `floor`        | |
| `round`        | |
| `ceil`         | |
| `sin`          | |
| `cos`          | |

### String

| **Method**     | Description |
| -------------- | ----------- |
| `toString`     | |
| `toUpper`      | Transforms the entire string to upper case |
| `tirm`         | |
| `split`        | |

### Boolean

| **Method**     | Description |
| -------------- | ----------- |
| `toString`     | |
| `==`           | |
| `!=`           | |
| `!`            | |
| `succ`         | |
