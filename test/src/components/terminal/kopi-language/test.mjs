import * as parser from './lib/parser.mjs';

const source = `
(program) => {
  {
    () => {
        newIndex ? {
            loop (newIndex)
        } : x
    }
  }
}
`;

console.log(1);
parser.parse(source, { tracer: (value) => console.log(value) });
console.log(2);
