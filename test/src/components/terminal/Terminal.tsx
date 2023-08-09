import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';

import * as kopi from './kopi-language';
import { KopiArray, KopiFunction, KopiNumber, KopiString, KopiTuple } from './kopi-language/src/classes';
import { Context, Environment, KopiValue } from './kopi-language/src/types';
import KopiStream_T from './kopi-language/src/classes/KopiStream';
import KopiRange from './kopi-language/src/classes/KopiRange';
import Calendar from '../calendar/Calendar';

class KopiDate extends KopiValue implements KopiValue {
  override async inspect() {
    return new Date().toLocaleString();
  }

  async apply(thisArg: this, [value]: [value: KopiValue]) {
    return value;
  }
}

class KopiSleep extends KopiValue {
  async apply(thisArg: this, [seconds]: [KopiNumber]) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(seconds), seconds.value * 1000);
    });
  }
}

class KopiLet extends KopiValue {
  async apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    let result: KopiValue = KopiTuple.empty;
    let i = 0;

    do {
      result = result instanceof KopiLoop ? result.value : result;

      result = await func.apply(KopiTuple.empty, [result, context]);
    } while (result instanceof KopiLoop && ++i < 10);

    return result instanceof KopiLoop ? result.value : result;
  }
}

class KopiLoop extends KopiValue {
  constructor(value: KopiValue) {
    super();

    this.value = value;
  }

  value: KopiValue;
}

class KopiLoopFunction extends KopiValue {
  async apply(thisArg: this, [value, context]: [KopiValue, Context]) {
    return new KopiLoop(value);
  }
}

class KopiApply extends KopiValue {
  async apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    return (arg: KopiValue) => {
      return func.apply(KopiTuple.empty, [arg, context]);
    };
  }
}

class KopiIdent extends KopiValue {
  async apply(thisArg: this, [value, context]: [KopiFunction, Context]) {
    return value;
  }
}

class KopiFetch extends KopiValue {
  async apply(thisArg: this, [url, context]: [KopiString, Context]) {
    return new KopiString((await (await fetch(url.value)).text()));
  }
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

class KopiIcon extends KopiValue {
  async inspect() {
    return <Icon icon="house" size="3x" />;
  }
}

class KopiRandom extends KopiValue {
  async apply(thisArg: this, [range, context]: [KopiRange, Context]) {
    const from = (await range.from as KopiNumber).value;
    const to = (await range.to as KopiNumber).value;

    return new KopiNumber(Math.random() * (to - from) + from);
  }
}

class KopiRepeat extends KopiValue {
  static RepeatStream = KopiStream_T(KopiArray.fromIterable);

  async apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    const generator = async function* (this: KopiValue) {
      for (let n = 0; ; ++n) {
        if (n >= 10) break;

        yield new KopiNumber(n);
      }
    }.apply(KopiTuple.empty, []);

    return new KopiRepeat.RepeatStream(generator);
  }
}

class KopiMeter extends KopiValue {
  async apply(thisArg: this, [value]: [KopiNumber]) {
    return new MetricUnit(value);
  }
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

function sleep() {
  return new Promise((resolve) =>
    setTimeout(resolve, 2000));
}

// class Coroutine extends KopiValue {
//   readonly gen: AsyncIterator<KopiValue, KopiValue, KopiValue>;
//   value: KopiValue = KopiTuple.empty;
//   yielder: KopiFunction | null = null;

//   constructor(func: KopiFunction, context: Context) {
//     super();

//     this.gen = this.generator(func, context);

//     this.gen.next();
//   }

//   async *generator(
//     func: KopiFunction,
//     context: Context
//   ): AsyncIterator<KopiValue, KopiValue, KopiValue> {
//     const { evaluate, environment, bind } = context;

//     this.value = yield KopiTuple.empty;

//     await evaluate(func.bodyExpression, environment, bind);

//     if (this.yielder) {
//       await sleep();

//       this.value = yield await this.yielder.apply(KopiTuple.empty, [this.value, context]);
//     }

//     return KopiTuple.empty;
//   }

//   async yield(func: KopiFunction, context: Context) {
//     this.yielder = func;
//   }

//   async send(value: KopiValue) {
//     return (await this.gen.next(value)).value;
//   }
// }

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

class KopiSpawn extends KopiValue {
  async apply(thisArg: this, [func, context]: [KopiFunction, Context]) {
    const coro = new Coroutine();

    (func.environment as any).yield = coro.yield.bind(coro);

    func.apply(KopiTuple.empty, [KopiTuple.empty, context]);

    return coro;
  }
}

//

let environment = new Environment({
  PI: new KopiNumber(Math.PI),
  E: new KopiNumber(Math.E),
  let: new KopiLet(),
  loop: new KopiLoopFunction(),
  apply: new KopiApply(),
  ident: new KopiIdent(),
  date: new KopiDate(),
  sleep: new KopiSleep(),
  clock: new KopiClock(),
  calendar: new KopiCalendar(),
  icon: new KopiIcon(),
  fetch: new KopiFetch(),
  random: new KopiRandom(),
  repeat: new KopiRepeat(),
  km: new KopiMeter(),
  spawn: new KopiSpawn(),
});

const bind = (bindings: { [name: string]: KopiValue; }) => {
  const newEnvironment = { ...environment, ...bindings };

  environment = newEnvironment;
};

const HistoryLine = ({
  children,
  ...props
}: ViewProps) => {
  return (
    <View horizontal paddingVertical="xsmall" {...props}>
      <Icon icon="angle-right" style={{ marginTop: 0 }} />
      <Spacer size="xsmall" />
      <View style={{ marginTop: 1 }}>
        {children}
      </View>
    </View>
  );
};

type HistoryItemProps = {
  source: string,
  onItemSelect: (source: string) => void;
};

const HistoryItem = ({
  source,
  onItemSelect
}: HistoryItemProps) => {
  return (
    <Text padding="small" style={{ whiteSpace: 'pre' }} onClick={() => onItemSelect(source)}>
      {source}
    </Text>
  );
};

const historyItems = [
  `date`,
  `clock`,
  `calendar`,
  `1 + 2 * 3`,
  `(1 + 2) * 3`,
  `random 4.5..5.5`,
  `sleep 5 + sleep 5`,
  `("a", "b", "c").1`,
  `((), 1, 'ast, "3", [])`,
  `(a => b => a + b) 1 2`,
  `((a, b) => a + b) (1, 2)`,
  `((a, b = 2) => a + b) 1`,
  // `1..3 | flatMap a => ((a + 1)..3 | map b => (a, b))`,
  `((a = 1, b = 2) => a + b) ()`,
  `let (a = 1) => a`,
  `let (a = 1, b = 2) => a + b`,
  `('1, 'sin, '(sin 30))`,
  `'sin (30 * (PI / 180))`,
  `'cos (30 * (PI / 180))`,
  `fetch "robots.txt"`,
  `'size (fetch "robots.txt")`,
  `add1 = n => n + 1`,
  `add1 5`,
  `"abc" | map (c) => 'toUpper c`,
  `"🥥🍏🍓" | map 'succ`,
  `"🥥🍏🍓" | at 1`,
  `"abc" | split | map 'succ`,
  `"a,b,c" | split ","`,
  `("ab", "xy") | map (a, x) => a x`,
  `[(1..5).from, (1..5).to]`,
  `1..5 | take 3 | map (n) => n * n`,
  `1..(fetch "robots.txt" | size)`,
  `1..5 | take 3 | map '(toFixed 2)`,
  `1..10 | filter (n) => n % 2 == 0`,
  `", " | combine 1..3`,
  `1..3 | join ", "`,
  `", " | combine "abc"`,
  `"abc" | join ", "`,
  `1..3 | map '(toFixed 2) | join ", "`,
  `1..5 | reduce (a = 1, n) => a * n`,
  `"abc" | reduce (a, c) => a ", " c`,
  `[sleep 5, sleep 5]`,
  `[1, "two", 1..3, n => n * n]`,
  `[1, 2, 3] | at 1`,
  `[1, 2] | reduce (a, n) => a + n`,
  `[1, 2, 3] | take 2 | take 1`,
  `(1..2, 3..4) | map (a, b) => a * b`,
  `1..3 | repeat | take 7`,
  `0..0.5 (0.1) | map '(toFixed 1)`,
  `(1 == 1, "a" == "a", 'b == 'b)`,
  `(1, "a", 'b) == (1, "a", 'b)`,
  `[1, "a", 'b] == [1, "a", 'b]`,
  `[1, 2, 3] == 'toArray 1..3`,
  `fs = ['(map n => n * n)]`,
  `fs | reduce (x = 1..5, f) => f x`,
  `1..3 | combos`,
  `square = (a, b) => a * b`,
  `1..4 | combos | map square`,
  `"abc" | combos`,
  `[1, 2, 3] | combos`,
  `1..3 | some n => n == 2`,
  `"abc" | some c => c == "b"`,
  `['a, 'b, 'c] | some c => c == 'b`,
  `"aaa" | every c => c == "a"`,
  `['a, 'a, 'a] | every c => c == 'a`,
  `1..3 | find (n) => n == 2`,
  `[1, 2, 3] | find (n) => n == 2`,
  `"abc" | find (c) => c == "b"`,
  `1..5 | count (n) => 'even n`,
  `[1, 2, 3] | count (n) => 'even n`,
  `"abc" | count (c) => c == "b"`,
  `1..5 | map '(* 3) | count 'even`,
  `1..3 | includes 2`,
  `"abc" | includes "b"`,
  `[1, 2, 3] | includes 2`,
  `1..10 | splitOn 3`,
  `"aa,b,cc" | splitOn ","`,
  `[1, 1, 0, 2, 0, 3, 3] | splitOn 0`,
  `1..10 | splitEvery 3`,
  `"abcdefghij" | splitEvery 3`,
  `[1, 2, 3] | splitEvery 2`,
  `coro = spawn () => {
  let (x = 10) => {
    yield n => n + x
    yield n => n * x
  }
}`,
  `coro | send 5`,
];

const Value = ({ promise }: any) => {
  const [element, setValue] = useState<React.ReactElement | null>(
    <View minHeight={20} align="center">
      <Icon icon="spinner" spin />
    </View>
  );

  useEffect(() => {
    (async () => {
      const element = await promise;

      if (element) {
        setValue(element);
      } else {
        setValue(null);
      }
    })();
  }, [promise]);

  return (
    element
  );
};

const interpret = async (
  source: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  setHistory: React.Dispatch<React.SetStateAction<React.ReactElement<any, string | React.JSXElementConstructor<any>>[]>>
) => {
  setHistory(history => [
    ...history,
    <HistoryLine>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{source}</Text>
    </HistoryLine>
  ]);

  setInputValue('');

  const promise = new Promise(async (resolve, reject) => {
    try {
      const value = await kopi.interpret(source, environment, bind);

      if (value) {
        resolve(
          <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
            {await value?.inspect()}
          </Text>
        );
      } else {
        resolve(value);
      }

    } catch (error) {
      console.warn(error);

      resolve(
        <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
          {(error as Error).toString()}
        </Text>
      );
    }
  });

  setHistory(history => [
    ...history,
    <View horizontal>
      <Value promise={promise} />
    </View>
  ]);
};

const initialHistory = [
  <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
    Kopi shell – a simple, immutable, async programming langauge.<br />
    Type a command such as "date", "clock", or "calendar".
  </Text>,
  <Clock style={{ width: 150 }} />
];

const Terminal = ({ ...props }: any) => {
  const historyElementRef = useRef<HTMLElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<React.ReactElement[]>(initialHistory);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      interpret(inputValue, setInputValue, setHistory);
    }
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    firstEventRef.current = event;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (firstEventRef.current) {
      if (
        event.button === 0
        && event.clientX === firstEventRef.current.clientX
        && event.clientY === firstEventRef.current.clientY
      ) {
        inputElementRef.current?.focus();
      }
    }
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      if (historyElementRef.current) {
        historyElementRef.current.scrollTop = historyElementRef.current.scrollHeight;
      }
    });
  }, [history]);

  return (
    <Stack horizontal divider {...props} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <View flex>
        <View horizontal padding="small large" fillColor="gray-1">
          <Button icon="trash-alt" onClick={() => setHistory([])} />
          <Spacer flex size="large" />
          <Button icon="history" selected={isHistoryVisible} onClick={() => setIsHistoryVisible(isHistoryVisible => !isHistoryVisible)} />
        </View>
        <Divider />
        <View ref={historyElementRef} paddingHorizontal="small" style={{ overflowY: 'auto' }}>
          <Spacer size="small" />
          {history.map((item, index) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </View>
        <View horizontal align="left" paddingHorizontal="small" style={{ marginTop: -5 }}>
          <Input ref={inputElementRef} flush lines={1} icon="angle-right" value={inputValue} onChange={handleInputChange} onKeyDown={handleInputKeyDown} />
        </View>
        <Spacer size="small" />
      </View>
      {isHistoryVisible && (
        <View>
          <View fillColor="gray-1" padding="small large" minHeight={48} align="bottom left">
            <Text fontSize="medium">History</Text>
          </View>
          <Divider />
          <View padding="small" style={{ overflow: 'auto' }}>
            {historyItems.map((item, index) => (
              <HistoryItem key={index} source={item} onItemSelect={(source: string) => interpret(source, setInputValue, setHistory)} />
            ))}
          </View>
        </View>
      )}
    </Stack>
  );
};

export default Terminal;
