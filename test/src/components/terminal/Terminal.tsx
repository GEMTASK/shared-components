import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';

import * as kopi from './kopi-language';

import { KopiArray, KopiNumber, KopiString, KopiTuple, KopiDate, KopiBoolean, KopiDict } from './kopi-language/src/classes';
import { Context, Environment, KopiValue } from './kopi-language/src/types';

import historyItems from './examples';
import * as functions from './functions';

const MONOSPACE_FONT = 'Iosevka';

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
          return React.createElement(awaitedChild.component, awaitedChild.props, await this.inspectChildren(awaitedChild.children.elements));
        }

        return React.createElement(awaitedChild.component, awaitedChild.props) as any;
      })
    );
  }

  async inspect() {
    if (this.children instanceof KopiString) {
      return React.createElement(this.component, this.props, this.children.value) as any;
    } else if (this.children) {
      return React.createElement(this.component, this.props, await this.inspectChildren(this.children.elements)) as any;
    }

    return React.createElement(this.component, this.props) as any;
  }
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

async function kopi_Text(props: KopiTuple) {
  const [fillColor, padding, align] = await Promise.all([
    (props as any).fillColor,
    (props as any).padding,
    (props as any).align
  ]);

  return (string: any) => {
    return new KopiElement(Text, {
      fillColor: fillColor?.value,
      padding: padding?.value,
      align: align?.value
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

async function kopi_useState(initialValue: KopiValue) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState(initialValue);

  return new KopiTuple([value, setValue as any]);
}

function transform(value: unknown): KopiValue {
  if (value === null) {
    return KopiTuple.empty;
  } else if (Array.isArray(value)) {
    return new KopiArray(value.map(value => transform(value)));
  } else if (typeof value === 'object') {
    return new KopiTuple(
      Object.values(value).map(value => transform(value)),
      Object.keys(value)
    );
  } else if (typeof value === 'string') {
    return new KopiString(value);
  } else if (typeof value === 'number') {
    return new KopiNumber(value);
  } else if (typeof value === 'boolean') {
    return new KopiBoolean(value);
  }

  return KopiTuple.empty;
}

class KopiObject extends KopiValue {
  static fromJsonString(jsonString: KopiString) {
    const json = JSON.parse(jsonString.value);

    return transform(json);
  }
}

let environment = new Environment({
  PI: new KopiNumber(Math.PI),
  E: new KopiNumber(Math.E),
  Object: KopiObject,
  Tuple: KopiTuple,
  Array: KopiArray,
  String: KopiString,
  Number: KopiNumber,
  Dict: KopiDict,
  Date: KopiDate,
  //
  let: functions.kopi_let,
  loop: functions.kopi_loop,
  match: functions.kopi_match,
  apply: functions.kopi_apply,
  eval: functions.kopi_eval,
  ident: functions.kopi_ident,
  sleep: functions.kopi_sleep,
  fetch: functions.kopi_fetch,
  random: functions.kopi_random,
  repeat: functions.kopi_repeat,
  struct: functions.kopi_struct,
  extend: functions.kopi_extend,
  spawn: functions.kopi_spawn,
  context: functions.kopi_context,
  km: functions.kopi_meter,
  //
  date: new functions.KopiDateFunction(),
  clock: new functions.KopiClock(),
  calendar: new functions.KopiCalendar(),
  //
  View: kopi_View,
  Text: kopi_Text,
  Button: kopi_Button,
  useState: kopi_useState,
});

const useSidebarStyles = createUseStyles({
  Item: {
    '&:hover': {
      background: '#f1f3f5',
      borderRadius: 2.5,
    },
    '&:active': {
      background: '#dee2e6',
      borderRadius: 2.5,
    },
  }
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
  const styles = useSidebarStyles();

  return (
    <Text
      padding="small"
      className={styles.Item}
      style={{ whiteSpace: 'pre', fontFamily: MONOSPACE_FONT }}
      onClick={() => onItemSelect(source)}
    >
      {source}
    </Text>
  );
};

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
      <Text style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}>
        {source}
      </Text>
    </HistoryLine>
  ]);

  setInputValue('');

  const promise = new Promise(async (resolve, reject) => {
    try {
      async function kopi_print(value: KopiValue) {
        const string = await value.toString();

        setHistory(history => [
          ...history,
          <Text
            align="left"
            paddingVertical="xsmall"
            style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}
          >
            {string}
          </Text>
        ]);

        // resolve(undefined);
      }

      const value = await kopi.interpret(source, { ...environment, print: kopi_print }, bind);

      if (value) {
        const element = await value?.inspect();

        if (typeof element === 'string') {
          resolve(
            <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}>
              {element}
            </Text>
          );
        } else {
          resolve(element);
        }
      } else {
        resolve(value);
      }

    } catch (error) {
      console.warn(error);

      resolve(
        <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}>
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
  <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}>
    Kopi shell – a simple, immutable, async programming langauge.<br />
    Type a command such as "date", "clock", or "calendar".
  </Text>,
  <Clock style={{ width: 150 }} />
];

const Terminal = ({ ...props }: any) => {
  const historyElementRef = useRef<HTMLElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const eventCount = useRef(0);

  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<React.ReactElement[]>(initialHistory);
  const [isHistoryVisible, setIsHistoryVisible] = useState(window.innerWidth >= 640);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

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
    eventCount.current += 1;

    if (eventCount.current === 2) {
      clearTimeout(eventTimerRef.current);

      eventCount.current = 0;

      return;
    }

    eventTimerRef.current = setTimeout(() => {
      if (
        event.button === 0
        && firstEventRef.current
        && event.clientX === firstEventRef.current.clientX
        && event.clientY === firstEventRef.current.clientY
      ) {
        inputElementRef.current?.focus();
      }

      eventCount.current = 0;
    }, 300);
  };

  useLayoutEffect(() => {
    setTimeout(() => {
      if (historyElementRef.current) {
        historyElementRef.current.scrollTop = historyElementRef.current.scrollHeight;
      }
    });
  }, [history]);

  const reference = [
    {
      title: 'Basic Syntax', content: [
        { code: `(1 + 2) ^ 3`, label: 'Basic arithmetic' },
        { code: `str = "Hello"`, label: 'Basic assignment' },
        { code: `[a, b] = "ab"`, label: 'Pattern matching' },
        { code: `"ab" == "ab"`, label: 'Equality operator' },
        { code: `"ab" != "ab"`, label: 'Equality operator' },
        { code: `<  <=  >  >=`, label: 'Relational operators' },
        { code: `(a && b) || c`, label: 'Logical operators' },
        { code: `"ab" ++ "cd"`, label: 'Concatenation operator' },
        { code: `a << { y: 2 }`, label: 'Dict merge operator' },
        { code: `print "Hello"`, label: 'Function application' },
        { code: `f (x) = x * x`, label: 'Function definition' },
        { code: `(x) => x * x`, label: 'Anonymous function' },
        { code: `5 | toFixed 2`, label: 'Method invocation' },
        { code: `'(toFixed 2) 5`, label: 'Alternate invocation' },
        { code: `(1, y: 2).1`, label: 'Tuple index access' },
        { code: `(1, y: 2).y`, label: 'Tuple field access' },
        { code: `array.(3)`, label: 'Array index access' },
        { code: `array.(1..5)`, label: 'Array slice access' },
        { code: `x < 0 ? -x : x`, label: 'Conditional expression' },
        { code: `{ a <nl> b }`, label: 'Multiple statements' },
      ]
    },
    {
      title: 'Basic Types', content: [
        { code: `1  -2.5  3.14`, label: 'Number', extra: `1 => "One"` },
        { code: `"Hello, world"`, label: 'String', extra: `"One" => 1` },
        { code: `true  false`, label: 'Boolean', extra: `true => 2` },
        { code: `'ident  '(+ 1)`, label: 'ASTree', extra: `'foo => 3'` },
        { code: `1..5  "a".."z"`, label: 'Range', extra: `1..5 => "5"` },
        { code: `(1, y: "abc")`, label: 'Tuple', extra: `(1, x) => x` },
        { code: `[1, 2, 3, 4]`, label: 'Array', extra: `[2, y] => y` },
        { code: `{ x: 1, y: 2 }`, label: 'Dict', extra: `{x: x} => x` },
        { code: `(x) => x * x`, label: 'Function' },
      ]
    },
    {
      title: 'Core Functions', content: [
        {
          code: `sleep 0.5`
        },
        {
          code: `random 0.5..1.5`
        },
        {
          code: `fetch "https://google.com"`
        },
        {
          code: `
let (n = 0) => {
  n < 5 ? loop (n + 1) : n
}
        `, label: null, extra: null
        },
        {
          code: `
match expr (
  (1, [a, b]) => a + b
)
`
        },
        {
          code: `
extend String (
  foo: () => this + "foo"
)
`
        },
        {
          code: `
spawn () => {
  yield (x) => x + 1
}
`
        },
      ]
    },
  ];

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
          <Input ref={inputElementRef} flush lines={1} icon="angle-right" value={inputValue} style={{ fontFamily: MONOSPACE_FONT }} onChange={handleInputChange} onKeyDown={handleInputKeyDown} />
        </View>
        <Spacer size="small" />
      </View>
      {isHistoryVisible && (
        <View style={{ width: 300 }}>
          <Stack horizontal spacing="large" paddingHorizontal="large" fillColor="gray-1" >
            <Text fontSize="medium" padding="small none" minHeight={48} align="bottom left" style={{ opacity: activeTabIndex === 0 ? 1.0 : 0.5 }} onPointerDown={() => setActiveTabIndex(0)}>Examples</Text>
            <Text fontSize="medium" padding="small none" minHeight={48} align="bottom left" style={{ opacity: activeTabIndex === 1 ? 1.0 : 0.5 }} onPointerDown={() => setActiveTabIndex(1)}>Reference</Text>
          </Stack>
          <Divider />
          <View flex padding="small" style={{ overflow: 'auto' }}>
            {activeTabIndex === 0 && (
              historyItems.map((item, index) => (
                <HistoryItem key={index} source={item.trim()} onItemSelect={(source: string) => (
                  interpret(source, setInputValue, setHistory)
                )} />
              ))
            )}
            {activeTabIndex === 1 && (
              <Stack spacing="medium" padding="small">
                {reference.map(section => (
                  <>
                    <Text caps fontSize="xsmall" fontWeight="semibold">{section.title}</Text>
                    <Spacer size="small" />
                    <table style={{ borderSpacing: 0 }}>
                      <tbody>
                        {section.content.map(item => (
                          <tr>
                            <td style={{ paddingBottom: 8 }}>
                              <Text fontSize="xsmall" style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
                                {item.code.trim()}
                              </Text>
                            </td>
                            <td style={{ paddingBottom: 8, paddingLeft: 16 }}>
                              <Text fontSize="xsmall">
                                {item.label}
                              </Text>
                            </td>
                            {item.extra && (
                              <td style={{ width: 120, paddingBottom: 8, paddingLeft: 16 }}>
                                <Text fontSize="xsmall" style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
                                  {item.extra}
                                </Text>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ))}
              </Stack>
            )}
          </View>
        </View>
      )}
    </Stack>
  );
};

export default Terminal;
