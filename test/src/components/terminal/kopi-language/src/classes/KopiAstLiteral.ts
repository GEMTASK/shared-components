import { ASTNode, KopiValue } from '../types';

class KopiAstLiteral extends KopiValue {
  readonly value: ASTNode;

  constructor(value: ASTNode) {
    super();

    this.value = value;
  }
}

export default KopiAstLiteral;
