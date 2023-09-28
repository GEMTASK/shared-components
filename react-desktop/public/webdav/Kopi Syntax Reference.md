# Kopi Syntax Reference

## Kopi EBNF

```

//
// Expressions
//

Program
  = __ head:Statement? tail:(_ (Newline _)+ Statement)* __

Statement
  = Assignment
  / Expression

Assignment
  = identifierPattern:IdentifierPattern
    _ parameterPatterns:(_ PrimaryPattern)*
    _ "=" _ expression:Expression
  / pattern:PrimaryPattern _ "=" _ expression:Expression

Expression
  = PipeExpression

PipeExpression
  = head:ConcatExpression
    tail:(_ Newline* _ "|" _ Identifier _ FunctionExpression? (_ FunctionExpression)*)*

ConcatExpression
  = head:ConditionalExpression tail:(_ ("++" / "<<") _ ConcatExpression)?

ConditionalExpression
  = head:LogicalOrExpression
    tail:(_ "?" _ consequent:ConcatExpression _ ":" _ alternate:ConcatExpression)?
  / LogicalOrExpression

LogicalOrExpression
  = head:LogicalAndExpression tail:(_ "||" _ LogicalAndExpression)*

LogicalAndExpression
  = head:EqualityExpression tail:(_ "&&" _ EqualityExpression)*

EqualityExpression
  = head:RelationalExpression tail:(_ ("==" / "!=") _ RelationalExpression)*

RelationalExpression
  = head:AddExpression tail:(_ ("<=" / ">=" / "<" / ">") _ AddExpression)*

AddExpression
  = head:MultiplyExpression tail:(_ ("+" / "-") _ MultiplyExpression)*

MultiplyExpression
  = head:ExponentExpression tail:(_ ("*" / "/" / "%") _ ExponentExpression)*

ExponentExpression
  = leftExpression:ApplyExpression tail:(_ "^" _ rightExpression:ExponentExpression)?

ApplyExpression
  = expression:FunctionExpression _arguments:(_ FunctionExpression)*

FunctionExpression
  = parameterPattern:Pattern _ Newline* _ predicateExpression:("[" _ ConcatExpression _ "]")?
    _ "=>" _ Newline* _ bodyExpression:ConcatExpression
  / RangeExpression

RangeExpression
  = from:MemberExpression _ ".." _ to:MemberExpression
  / MemberExpression

MemberExpression
  = head:UnaryExpression tail:(".(" _ Expression _ ")")+
  / head:UnaryExpression tail:("." (Identifier / NumericLiteral))*

UnaryExpression
  = operator:("-" / "!") argumentExpression:UnaryExpression
  / PrimaryExpression

PrimaryExpression
  = "(" _ ")" _ !"=>"
  / "(" __ head:TupleField tail:(_ ("," /  Newline+) _ TupleField)* __ ")" _ !"=>"
  / boolean:BooleanLiteral _ !"=>"
  / number:NumericLiteral _ !"=>"
  / StringLiteral
  / ArrayLiteral
  / DictLiteral
  / AstLiteral
  / BlockExpression
  / identifier:Identifier _ !"=>"

TupleField
  = name: ((Identifier / Operator) ":")? _ expression:Expression

BlockExpression
  = "{" statements:Block "}"

Block
  = __ head:Statement? tail:(_ (Newline _)+ Statement)* __

//
// Patterns
//

Pattern
  = DefaultExpressionPattern
  / PrimaryPattern

DefaultExpressionPattern
  = pattern:PrimaryPattern _ "=" _ defaultExpression:Expression

PrimaryPattern
  = "(" _ ")"
  / "(" _ colon:(":")? head:Pattern tail:(_ "," _ (":")? Pattern)* _ ")"
  / ConstructorPattern
  / ArrayLiteralPattern
  / NumericLiteralPattern
  / StringLiteralPattern
  / BooleanLiteralPattern
  / IdentifierPattern

ConstructorPattern
  = typename:Typename _ argumentPattern:Pattern

ArrayLiteralPattern
  = "[" _ "]" _ !"=>"
  / init:(IdentifierPattern _ "++" _)? "[" _ head:Pattern? tail:(_ "," _ Pattern)* _ "]"
    rest:(_ "++" _ IdentifierPattern)?

NumericLiteralPattern
  = number:NumericLiteral

StringLiteralPattern
  = string:StringLiteral

BooleanLiteralPattern
  = boolean:BooleanLiteral

IdentifierPattern
  = identifier:Identifier

//
// Literals
//

BooleanLiteral "boolean"
  = value:("true" / "false")

NumericLiteral "number"
  = value:([0-9]+ ("." !"." [0-9]+)?)

StringLiteral "string"
  = _ "\"" value:("\\\"" / [^"])* "\"" _

ArrayLiteral
  = "[" __ head:Expression? tail:(_ ("," / Newline+) _ Expression)* __ "]" _ !"=>"

DictLiteral
  = "{" __ head:(PrimaryExpression ":" _ Expression)?
    tail:(_ ("," / Newline+) _ PrimaryExpression ":" _ Expression)* __ "}" _ !"=>"

AstLiteral "ast-literal"
  = "'(" _ operator:Operator _ argumentExpression:ApplyExpression ")"
  / "'" operator:Operator
  / "'" expression:PrimaryExpression

Identifier "identifier"
  = name:([_a-zA-Z][_a-zA-Z0-9]*)

Operator "operator"
  = name:("++" / "<<" / "+" / "-" / "*" / "/" / "%" / "^")

Typename "typename"
  = name:([A-Z][_a-zA-Z0-9]*)

//
// Miscellaneous
//

_ "space"
  = " "*

__ "whitespace"
  = (" " / Newline)*

Comment "comment"
  = "#" (!Newline .)*

Newline
  = Comment? [\r?\n]

```
