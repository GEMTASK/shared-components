import React, { useEffect, useReducer, useRef, useState } from 'react';
import * as WebDAV from 'webdav';

import { KopiArray, KopiBoolean, KopiFunction, KopiNumber, KopiString, KopiTuple } from './kopi-language/src/classes';
import { ASTNode, Bind, Context, KopiValue } from './kopi-language/src/types';

import KopiStream_T from './kopi-language/src/classes/KopiStream';
import KopiRange from './kopi-language/src/classes/KopiRange';
import KopiDate from './kopi-language/src/classes/KopiDate';

import Clock from '../clock/Clock';
import Calendar from '../calendar/Calendar';

import { Button, Text, View } from 'bare';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

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

  static async inspect() {
    return new Date().toLocaleString();
  }

  static async apply(thisArg: void, [value]: [value: KopiValue]) {
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
  static async inspect() {
    return <Clock style={{ width: 150 }} />;
  }
}

class KopiCalendar extends KopiValue {
  static async inspect() {
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

async function kopi_struct(tuple: KopiTuple, context: Context) {
  return class class_ extends KopiTuple {
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

class KopiLs_ {
  args: any[];

  constructor(args: any[]) {
    this.args = args;
  }

  async apply(thisArg: void, [arg]: [any]) {
    return new KopiLs_([...this.args, arg]);
  }

  async inspect() {
    const filename = this.args.at(-1) instanceof KopiString
      ? '/' + this.args.at(-1).value
      : '/';

    const directoryItems = await webdavClient.getDirectoryContents(filename);

    if (Array.isArray(directoryItems)) {
      const max = directoryItems.reduce((max, item) => item.basename.length > max
        ? item.basename.length
        : max,
        0);

      if (this.args.find(arg => arg.name === 'l')) {
        const items = directoryItems.map(({ basename, type, size, lastmod }) =>
          (basename + (type === 'directory' ? '/' : '')).padEnd(max + 4) +
          (size.toString() + ' B').padEnd(8) +
          new Date(lastmod).toLocaleDateString());

        return items.join('\n');
      }

      const items = directoryItems.map(({ basename, type, size, lastmod }) =>
        (basename + (type === 'directory' ? '/' : '')).padEnd(max + 4));

      return items.join('');
    }

    return '';
  }
}

class KopiLs {
  static async apply(thisArg: void, [arg]: [KopiValue]) {
    return new KopiLs_([arg]);
  }

  static async inspect() {
    return new KopiLs_([]).inspect();
  }
}

class KopiLog extends KopiString {
  async inspect() {
    return this.value;
  }
}

async function kopi_cat(filename: KopiString) {
  const str = await webdavClient.getFileContents('/' + filename.value, { format: 'text' });

  if (typeof str === 'string') {
    return new KopiLog(str);
  }

  return '';
}

class KopiElement extends KopiValue {
  component: React.ComponentType;
  props: any;
  children?: KopiArray;

  constructor(component: React.ComponentType, props: any, children?: KopiArray) {
    super();

    this.component = component;
    this.props = props;
    this.children = children;
  }

  async inspectChildren(children: any): Promise<React.ReactNode> {
    return Promise.all(
      children.map(async (child: any) => {
        const awaitedChild = await child;

        if (awaitedChild.children instanceof KopiString) {
          return React.createElement(this.component, awaitedChild.props, awaitedChild.children.value) as any;
        } else if (awaitedChild.children) {
          return React.createElement(awaitedChild.component, awaitedChild.props, await this.inspectChildren(awaitedChild.children._elements));
        }

        return React.createElement(awaitedChild.component, awaitedChild.props) as any;
      })
    );
  }

  async inspect() {
    if (this.children instanceof KopiString) {
      return React.createElement(this.component, this.props, this.children.value) as any;
    } else if (this.children) {
      return React.createElement(this.component, this.props, await this.inspectChildren(this.children._elements)) as any;
    }

    return React.createElement(this.component, this.props) as any;
  }
}

const reducer = (state: any, action: any) => {
  console.log(action.payload);
  // return ({ ...state, ...action.payload });
  return action.payload;
};

const Component = (component: KopiFunction, context: Context) => function _({ props }: any) {
  const functionRef = useRef<KopiFunction>();

  const [value, setValue] = useState<any>(null);
  const [state, dispatch] = useReducer(reducer, new KopiNumber(0));

  const setState = (payload: any) => dispatch({ type: 'setState', payload });

  useEffect(() => {
    (async () => {
      if (!functionRef.current) {
        functionRef.current = await component.apply(KopiTuple.empty, [setState, context]) as KopiFunction;
      }

      const value = await functionRef.current.apply(KopiTuple.empty, [state, context]);

      setValue(await value.inspect());
    })();
  }, [state]);

  return value;
};

async function kopi_element(tuple: KopiTuple, context: Context) {
  const [component, props, children] = await Promise.all(tuple.fields) as [KopiFunction, KopiTuple, KopiArray];

  return new KopiElement(
    Component(component, context),
    {},
    children
  );
}

async function kopi_component(component: KopiFunction, context: Context) {
  // const [component, props, children] = await Promise.all(tuple.fields) as [KopiFunction, KopiTuple, KopiArray];

  return (props: any) => (children: any) => new KopiElement(
    Component(component, context),
    {},
    children
  );
}

async function kopi_View(props: KopiTuple) {
  const [horizontal, fillColor, padding, border] = await Promise.all([
    (props as any).horizontal,
    (props as any).fillColor,
    (props as any).padding,
    (props as any).border
  ]);

  return (children: any) => {
    return new KopiElement(View, {
      horizontal: horizontal?.value,
      fillColor: fillColor?.value,
      padding: padding?.value,
      border: border?.value,
      style: { gap: 16 }
    }, children);
  };
}

async function kopi_Text(props: KopiTuple, context: Context) {
  const [fillColor, padding, align, onClick] = await Promise.all([
    (props as any).fillColor,
    (props as any).padding,
    (props as any).align,
    (props as any).onClick
  ]);

  return (string: any) => {
    return new KopiElement(Text, {
      fillColor: fillColor?.value,
      padding: padding?.value,
      align: align?.value,
      onClick: () => onClick?.apply(KopiTuple.empty, [KopiTuple.empty, context])
    }, string);
  };
}

async function kopi_Button(props: KopiTuple, context: Context) {
  const [title, solid] = await Promise.all([
    (props as any).title,
    (props as any).solid
  ]);

  return new KopiElement(Button, {
    solid: solid?.value,
    primary: true,
    title: title?.value,
  });
}

async function kopi_input(message: KopiString) {
  return new KopiString(prompt(message.value) ?? '');
}

async function kopi_export(value: KopiValue) {
  return value;
}

export {
  KopiDateFunction,
  KopiClock,
  KopiCalendar,
  KopiLs,
  //
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
  //
  kopi_meter,
  kopi_cat,
  //
  kopi_element,
  kopi_component,
  kopi_View,
  kopi_Text,
  kopi_Button,
  //
  kopi_input,
  kopi_export,
};
