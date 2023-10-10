import { ASTNode, ASTPatternNode, Context, Environment, KopiClass, KopiValue } from '../types.js';

class KopiFunction extends KopiClass {
  readonly parameterPattern: ASTPatternNode;
  readonly predicateExpression: ASTNode;
  readonly bodyExpression: ASTNode;
  readonly environment: Environment;
  readonly name?: string;

  constructor(
    parameterPattern: ASTPatternNode,
    predicateExpression: ASTNode,
    bodyExpression: ASTNode,
    environment: Environment,
    name?: string
  ) {
    super();

    this.parameterPattern = parameterPattern;
    this.predicateExpression = predicateExpression;
    this.bodyExpression = bodyExpression;
    this.environment = environment;
    this.name = name;
  }

  async inspect() {
    return `<function>`;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { evaluate, bind } = context;

    const matches = await this.parameterPattern.match(argument, context);

    // TODO: We only need a new env if assignment used (in a block)
    const newEnvironment = {
      ...this.environment,
      ...matches,
      ...(this.name && { [this.name]: this }),
      'this': thisArg
    };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment, bind);
  }
}

export default KopiFunction;
