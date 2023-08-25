import { KopiArray, KopiFunction, KopiNumber, KopiString, KopiTuple } from './kopi-language/src/classes';
import { ASTNode, Bind, Context, KopiValue } from './kopi-language/src/types';
import KopiStream_T from './kopi-language/src/classes/KopiStream';
import KopiRange from './kopi-language/src/classes/KopiRange';

import Clock from '../clock/Clock';
import Calendar from '../calendar/Calendar';
import { Identifier } from './kopi-language/src/astnodes';
import KopiDate from './kopi-language/src/classes/KopiDate';

async function kopi_let(func: KopiFunction, context: Context) {
  let result: KopiValue = KopiTuple.empty;

  do {
    result = result instanceof KopiLoop ? result.value : result;

    result = await func.apply(KopiTuple.empty, [result, context]);
  } while (result instanceof KopiLoop);

  return result instanceof KopiLoop ? result.value : result;
}

class KopiLoop extends KopiValue {
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
  return async (funcs: KopiTuple) => {
    for await (const func of funcs.fields) {
      if (await (func as KopiFunction).parameterPattern.test(value, context)) {
        return (func as KopiFunction).apply(KopiTuple.empty, [value, context]);
      }
    }

    throw new Error('Match failed');
  };
}

async function kopi_apply(func: KopiFunction, context: Context) {
  return (arg: KopiValue) => {
    return func.apply(KopiTuple.empty, [arg, context]);
  };
}

class KopiDateFunction extends KopiValue {
  static now() {
    return new KopiDate(new Date());
  }

  override async inspect() {
    return new Date().toLocaleString();
  }

  async apply(thisArg: this, [value]: [value: KopiValue]) {
    return value;
  }
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

class KopiClock extends KopiValue {
  async inspect() {
    return <Clock style={{ width: 150 }} />;
  }
}

class KopiCalendar extends KopiValue {
  async inspect() {
    return <Calendar style={{ width: 360 }} />;
  }
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

async function kopi_struct(identifier: Identifier, context: Context) {
  const { bind } = context;

  return (tuple: KopiTuple) => {
    const class_ = class extends KopiTuple {
      static apply(thisArg: void, [value]: [KopiTuple]) {
        return new class_(value);
      }

      constructor(value: KopiTuple) {
        super(value.fields, value._fieldNames);
      }

      async inspect() {
        return `${this.constructor.name} ${await super.inspect()}`;
      }
    };

    Object.defineProperty(class_, 'name', {
      value: identifier.name
    });

    bind({
      [identifier.name]: class_
    });
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

class Coroutine extends KopiValue {
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

class KopiContext extends KopiValue {
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

async function kopi_meter(value: KopiNumber) {
  return new MetricUnit(value);
}

class MetricUnit extends KopiValue {
  value: KopiNumber;

  constructor(value: KopiNumber) {
    super();

    this.value = new KopiNumber(value.value * 1000);
  }

  // toImperial() {
  //   return new ImperialUnit(new KopiNumber(this.value.value * 3.28084));
  // }
}

export {
  KopiDateFunction,
  KopiClock,
  KopiCalendar,
  kopi_let,
  kopi_loop,
  kopi_match,
  kopi_apply,
  kopi_eval,
  kopi_sleep,
  kopi_ident,
  kopi_fetch,
  kopi_random,
  kopi_repeat,
  kopi_struct,
  kopi_extend,
  kopi_spawn,
  kopi_context,
  kopi_meter,
};
