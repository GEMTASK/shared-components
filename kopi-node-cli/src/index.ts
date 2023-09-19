import readline from 'readline';
import * as kopi from 'kopi-language';

declare global {
  var environment: { [key: string | symbol]: any; };
}

class KopiEnv {
  static async inspect() {
    return Object.keys(globalThis.environment).map(key => key.padEnd(12)).join('');
  }
}

globalThis.environment = {
  env: KopiEnv,
  let: kopi.kopi_let,
  loop: kopi.kopi_loop,
  match: kopi.kopi_match,
  sleep: kopi.kopi_sleep,
  fetch: kopi.kopi_fetch,
  spawn: kopi.kopi_spawn,
  random: kopi.kopi_random,
  struct: kopi.kopi_struct,
  extend: kopi.kopi_extend,
};

const bind = (bindings: { [name: string]: kopi.KopiValue; }) => { };

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt: string) {
  rl.question(prompt, async (source) => {
    const value = await (await kopi.interpret(source, environment, bind))?.inspect();

    if (typeof value === 'string') {
      rl.write(value + '\n');
    }

    input(prompt);
  });
}

input('> ');
