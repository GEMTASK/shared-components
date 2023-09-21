# Kopi Methods

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
