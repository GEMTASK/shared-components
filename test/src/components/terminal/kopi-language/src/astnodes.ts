import { ASTNode } from './types';

class TupleExpression extends ASTNode {
  readonly expressionFields: ASTNode[];
  readonly fieldNames: string[];

  constructor({ expressionFields, fieldNames, location }: TupleExpression) {
    super(location);

    this.expressionFields = expressionFields;
    this.fieldNames = fieldNames;
  }
}

class OperatorExpression extends ASTNode {
  readonly operator: '+' | '-';
  readonly leftExpression: ASTNode;
  readonly rightExpression: ASTNode;

  constructor({ operator, leftExpression, rightExpression, location }: OperatorExpression) {
    super(location);

    this.operator = operator;
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
}

class FunctionExpression extends ASTNode {
  // readonly parameterPattern: ASTPatternNode;
  readonly parameterPattern: any;
  readonly bodyExpression: ASTNode;
  readonly name?: string;

  constructor({ parameterPattern, bodyExpression, name, location }: FunctionExpression) {
    super(location);

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.name = name;
  }
}

class ApplyExpression extends ASTNode {
  readonly expression: ASTNode;
  readonly argumentExpression: ASTNode;

  constructor({ expression, argumentExpression, location }: ApplyExpression) {
    super(location);

    this.expression = expression;
    this.argumentExpression = argumentExpression;
  }
};

//

class NumericLiteral extends ASTNode {
  readonly value: number;

  constructor({ value, location }: NumericLiteral) {
    super(location);

    this.value = value;
  }
}

class Identifier extends ASTNode {
  readonly name: string;

  constructor({ name, location }: Identifier) {
    super(location);

    this.name = name;
  }
}

export {
  TupleExpression,
  OperatorExpression,
  FunctionExpression,
  ApplyExpression,
  NumericLiteral,
  Identifier,
};
