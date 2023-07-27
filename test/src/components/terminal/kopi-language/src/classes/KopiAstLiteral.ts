import { ASTNode, ASTPatternNode, Context, Environment, KopiValue } from '../types';
import { Identifier } from '../astnodes';

import KopiTuple from './KopiTuple';

class KopiAstLiteral extends KopiValue {
  readonly value: ASTNode;

  constructor(value: ASTNode) {
    super();

    this.value = value;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    return argument.invoke((this.value as Identifier).name, [KopiTuple.empty, context]);
  }
}

export default KopiAstLiteral;
