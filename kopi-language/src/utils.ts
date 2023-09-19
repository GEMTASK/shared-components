const errors = {
  'number-operator-argument-type': [TypeError, ({ operator, value, type }: any) => `
There was a TypeError in the Number '${operator}' operator:
⚠️ The right side must be a Number, but found value ${value} of type ${type}.

Hint: You can convert a String to a Number by using the Number constructor. For example 'Number "5"'.
`],
  'number-method-argument-type': [TypeError, ({ method, value, type }: any) => `
There was a TypeError in the Number '${method}' method:
⚠️ The argument must be a number, but found ${value} of type ${type}.

Hint: You can convert a String to a Number by using the Number constructor. For example 'Number "5"'.
`],
} as const;

const error = (key: keyof typeof errors, options: {} = {}) => {
  const [error, message] = errors[key];

  return new error(message(options).trim());
};

const spaces = (level: number) => {
  return '  '.repeat(level);
};

const inspect = (value: unknown, level: number = 0): string => {
  if (Array.isArray(value)) {
    const props = value.map((value) => `${spaces(level + 1)}${inspect(value, level + 1)}`);

    return value.length === 0
      ? `[]`
      : `[\n${props.join(',\n')}\n${spaces(level)}]`;
  }
  else if (typeof value === 'object') {
    const props = Object.entries(value ?? {}).map(
      ([name, value]) => `${spaces(level + 1)}${name}: ${inspect(value, level + 1)}`
    );

    return props.length === 0
      ? '{}'
      : `${value?.constructor.name} {\n${props.join(',\n')}\n${spaces(level)}}`;
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else if (typeof value === 'symbol') {
    return `Symbol(${value.description})`;
  } else if (typeof value === 'function') {
    return value.constructor.name;
  }

  return `${value}`;
};

export {
  error,
  inspect,
};
