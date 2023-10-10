import { ASTNode, KopiClass, KopiValue } from '../types.js';

class KopiAstLiteral extends KopiClass {
  readonly value: ASTNode;

  constructor(value: ASTNode) {
    super();

    this.value = value;
  }
}

export default KopiAstLiteral;
