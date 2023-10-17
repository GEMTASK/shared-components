import readline from 'readline';
import kopi from 'kopi-language';

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
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt: string) {
  rl.question(prompt, async (source) => {
    const value = await (await kopi.interpret(source, environment))?.inspect();

    if (typeof value === 'string') {
      rl.write(value + '\n');
    }

    input(prompt);
  });
}

input('> ');
