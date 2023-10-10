/* eslint-disable import/no-anonymous-default-export */

import { KopiArray, KopiBoolean, KopiFunction, KopiNumber, KopiString, KopiTuple } from '../classes/index.js';
import { ASTNode, Bind, Context, KopiClass, KopiValue } from '../types.js';

import KopiStream_T from '../classes/KopiStream.js';
import KopiRange from '../classes/KopiRange.js';

async function kopi_let(func: KopiFunction, context: Context) {
  let result: KopiValue = KopiTuple.empty;

  do {
    result = result instanceof KopiLoop ? result.value : result;

    result = await func.apply(KopiTuple.empty, [result, context]);
  } while (result instanceof KopiLoop);

  return result instanceof KopiLoop ? result.value : result;
}

class KopiLoop extends KopiClass {
  constructor(value: KopiValue) {
    super();

    this.value = value;
  }

  value: KopiValue;
}

async function kopi_loop(value: KopiValue, context: Context) {
  return new KopiLoop(value);
}

async function kopi_match(value: KopiValue, context: Context) {
  const { evaluate, environment, bind } = context;

  return async (funcs: KopiTuple) => {
    for await (const func of funcs.fields) {
      if (await (func as KopiFunction).parameterPattern.test(value, context)) {
        const predicateExpression = (func as KopiFunction).predicateExpression;

        if (predicateExpression) {
          const matches = await (func as KopiFunction).parameterPattern.match(value, context);
          const predicateValue = await evaluate(predicateExpression, { ...environment, ...matches }, bind);

          if ((predicateValue as KopiBoolean).value) {
            return (func as KopiFunction).apply(KopiTuple.empty, [value, context]);
          }
        } else {
          return (func as KopiFunction).apply(KopiTuple.empty, [value, context]);
        }
      }
    }

    throw new Error(`Match failed for value '${await value.inspect()}' of type ${await value.constructor.inspect()}.`);
  };
}

async function kopi_apply(func: KopiFunction, context: Context) {
  return (arg: KopiValue) => {
    return func.apply(KopiTuple.empty, [arg, context]);
  };
}

async function kopi_sleep(seconds: KopiNumber) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(seconds), seconds.value * 1000);
  });
}

async function kopi_eval(node: ASTNode, context: Context) {
  const { evaluate, environment, bind } = context;

  return evaluate(node, environment, bind);
}

async function kopi_ident(value: KopiFunction, context: Context) {
  return value;
}

async function kopi_fetch(url: KopiString, context: Context) {
  return new KopiString((await (await fetch(url.value)).text()));
}

async function kopi_random(range: KopiRange, context: Context) {
  const from = (await range.from as KopiNumber).value;
  const to = (await range.to as KopiNumber).value;

  return new KopiNumber(Math.random() * (to - from) + from);
}

const RepeatStream = KopiStream_T(KopiArray.fromIterable);

async function kopi_repeat(func: KopiFunction, context: Context) {
  const generator = async function* (this: KopiValue) {
    for (let n = 0; ; ++n) {
      if (n >= 10) break;

      yield new KopiNumber(n);
    }
  }.apply(KopiTuple.empty, []);

  return new RepeatStream(generator);
}

async function kopi_struct(tuple: KopiTuple, context: Context) {
  return class struct extends KopiTuple {
    static apply(thisArg: void, [value]: [KopiTuple]) {
      return new struct(value);
    }

    constructor(value: KopiTuple) {
      super(value.fields, value._fieldNames);
    }

    async inspect() {
      return `${this.constructor.name} ${await super.inspect()}`;
    }
  };
}

function kopi_extend(constructor: Function, context: Context) {
  const { environment, bind } = context;

  const extensions = environment._extensions as unknown as Map<Function, any> ?? new Map();

  return async (methods: KopiTuple) => {
    const awaitedFields = await Promise.all(methods.fields);

    bind({
      ...environment,
      _extensions: new Map([
        ...extensions,
        [constructor, {
          ...extensions.get(constructor),
          ...awaitedFields.reduce((newMethods, field, index) => ({
            ...newMethods,
            [methods._fieldNames[index]]: field
          }), {})
        }]
      ]) as any
    });
  };
}

class Deferred<T> {
  resolve?: (value: T) => void;
  reject?: (reason?: any) => void;

  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

class Channel {
  promiseQueue: Deferred<[KopiValue, Deferred<KopiValue>]>[] = [];
  valueQueue: [KopiValue, Deferred<KopiValue>][] = [];

  read() {
    const envelope = new Deferred<[KopiValue, Deferred<KopiValue>]>();

    if (this.valueQueue.length > 0) {
      const value = this.valueQueue.shift();

      if (value) {
        return Promise.resolve(value);
      }
    } else {
      this.promiseQueue.push(envelope);
    }

    return envelope.promise;
  }

  write(value: KopiValue) {
    const reply = new Deferred<KopiValue>();

    if (this.promiseQueue.length > 0) {
      const envelope = this.promiseQueue.shift();

      envelope?.resolve?.([value, reply]);
    } else {
      this.valueQueue.push([value, reply]);
    }

    return reply.promise;
  }
}

//

class Coroutine extends KopiClass {
  channel: Channel = new Channel();

  async yield(func: KopiFunction, context: Context) {
    const [value, reply] = await this.channel.read();

    const result = await func.apply(KopiTuple.empty, [value, context]);

    reply.resolve?.(result);
  }

  send(value: KopiValue) {
    return this.channel.write(value);
  }
}

async function kopi_spawn(func: KopiFunction, context: Context) {
  const coro = new Coroutine();

  func.apply(KopiTuple.empty, [coro.yield.bind(coro), context]);

  return coro;
}

class KopiContext extends KopiClass {
  symbol: symbol;

  constructor(value: KopiValue, bind: Bind) {
    super();

    this.symbol = Symbol();

    bind({
      [this.symbol]: value,
    });
  }

  set(value: KopiValue, context: Context) {
    const { bind } = context;

    bind({
      [this.symbol]: value,
    });
  }

  get(_: KopiValue, context: Context) {
    const { environment } = context;

    return environment[this.symbol as keyof typeof environment];
  }
}

async function kopi_context(value: KopiValue, context: Context) {
  const { bind } = context;

  return new KopiContext(value, bind);
}

export default {
  kopi_let,
  kopi_loop,
  kopi_match,
  kopi_apply,
  kopi_sleep,
  kopi_eval,
  kopi_ident,
  kopi_fetch,
  kopi_random,
  kopi_repeat,
  kopi_struct,
  kopi_extend,
  kopi_spawn,
  kopi_context,
};

export {
  kopi_let,
  kopi_loop,
  kopi_match,
  kopi_apply,
  kopi_sleep,
  kopi_eval,
  kopi_ident,
  kopi_fetch,
  kopi_random,
  kopi_repeat,
  kopi_struct,
  kopi_extend,
  kopi_spawn,
  kopi_context,
};
