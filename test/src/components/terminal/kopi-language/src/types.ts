interface RawASTNode {
  [key: string]: any;
}

class ASTNode {
  location: {} = {};

  constructor(location: {}) {
    this.location = location;
  }
}

export {
  type RawASTNode,
  ASTNode,
};
