import React, { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { createClient } from 'webdav';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';

import * as kopi from './kopi-language';

import { KopiAny, KopiArray, KopiNumber, KopiString, KopiTuple, KopiDate, KopiBoolean, KopiDict, KopiFunction } from './kopi-language/src/classes';
import { Context, KopiValue } from './kopi-language/src/types';

import exampless from './examples';
import reference from './reference';

import * as functions from './functions';

const MONOSPACE_FONT = 'Iosevka';

const webdavClient = createClient("https://webdav.mike-austin.com", {});

const Link = ({ children, ...props }: any) => {
  return (
    <Text textColor="blue-5" {...props} innerProps={{ style: { cursor: 'pointer' } }}>
      {children}
    </Text>
  );
};

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

class KopiEnv {
  static async inspect() {
    return Object.keys(environment).map(key => key.padEnd(12)).join('');
  }
}

async function kopi_export(value: KopiValue) {
  return value;
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

async function kopi_cat(filename: KopiString) {
  const str = await webdavClient.getFileContents('/' + filename.value, { format: 'text' });

  if (typeof str === 'string') {
    return new KopiLog(str);
  }

  return '';
}

class KopiLog extends KopiString {
  async inspect() {
    return this.value;
  }
}

let environment = {
  PI: new KopiNumber(Math.PI),
  E: new KopiNumber(Math.E),
  Any: KopiAny,
  Tuple: KopiTuple,
  Array: KopiArray,
  String: KopiString,
  Number: KopiNumber,
  Boolean: KopiBoolean,
  Dict: KopiDict,
  Date: KopiDate,
  env: KopiEnv,
  //
  log: async (value: KopiValue) => console.log(await value.inspect()),
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
  input: kopi_input,
  export: kopi_export,
  ls: KopiLs,
  cat: kopi_cat,
  //
  date: new functions.KopiDateFunction(),
  clock: new functions.KopiClock(),
  calendar: new functions.KopiCalendar(),
  //
  element: kopi_element,
  component: kopi_component,
  View: kopi_View,
  Text: kopi_Text,
  Button: kopi_Button,
};

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
  setElementHistory: React.Dispatch<React.SetStateAction<React.ReactElement<any, string | React.JSXElementConstructor<any>>[]>>,
  setInputHistory: React.Dispatch<React.SetStateAction<string[]>>
) => {
  setInputHistory(inputHistory => [source, ...inputHistory]);

  setElementHistory(history => [
    ...history,
    <HistoryLine>
      <Text style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}>
        {source}
      </Text>
    </HistoryLine>
  ]);

  setInputValue('');

  const promise = new Promise(async (resolve, reject) => {
    try {
      async function kopi_import(url: KopiString) {
        // const source = await (await fetch(url.value)).text();
        const source = await webdavClient.getFileContents('/' + url.value, { format: 'text' });

        if (typeof source === 'string') {
          return kopi.interpret(source, { ...environment, print: kopi_print, import: kopi_import }, () => { });
        }
      }

      async function kopi_print(value: KopiValue) {
        const string = await value.toString();

        setElementHistory(history => [
          ...history,
          <Text
            align="left"
            paddingVertical="xsmall"
            style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}
          >
            {string}
          </Text>
        ]);

        // resolve(undefined);
      }

      const value = await kopi.interpret(source, { ...environment, print: kopi_print, import: kopi_import }, bind);

      if (value) {
        const element = await value?.inspect();

        if (typeof element === 'string') {
          resolve(
            <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}>
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
        <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}>
          {(error as Error).toString()}
        </Text>
      );
    }
  });

  setElementHistory(history => [
    ...history,
    <View horizontal>
      <Value promise={promise} />
    </View>
  ]);
};

const initialHistory = [
  <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}>
    Kopi shell – a simple, immutable, async programming langauge.<br />
    Read <Link onClick={() => window.postMessage({ type: 'openFile', payload: '/kopi.md' })}>Learning Kopi</Link> for an introduction and to learn more.
  </Text>,
  <Clock style={{ width: 150 }} />
];

const Terminal = ({ ...props }: any) => {
  console.log('Termianl()');

  const historyElementRef = useRef<HTMLElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);
  const eventTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const eventCount = useRef(0);

  const [inputValue, setInputValue] = useState('');
  const [elementHistory, setElementHistory] = useState<React.ReactElement[]>(initialHistory);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(window.innerWidth >= 640);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      interpret(inputValue, setInputValue, setElementHistory, setInputHistory);
    }

    if (event.key === 'ArrowUp' && inputValue === '') {
      setInputValue(inputHistory[0]);
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
  }, [elementHistory]);

  return (
    <Stack horizontal divider {...props} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
      <View flex>
        <View horizontal padding="small large" fillColor="gray-1">
          <Button icon="trash-alt" onClick={() => setElementHistory([])} />
          <Spacer flex size="large" />
          <Button icon="table-columns" selected={isHistoryVisible} onClick={() => setIsHistoryVisible(isHistoryVisible => !isHistoryVisible)} />
        </View>
        <Divider />
        <View ref={historyElementRef} paddingHorizontal="small" style={{ overflowY: 'auto', userSelect: 'text' }}>
          <Spacer size="small" />
          {elementHistory.map((item, index) => (
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
            <Text fontSize="medium" padding="small none" minHeight={48} align="bottom left" style={{ opacity: activeTabIndex === 0 ? 1.0 : 0.4 }} onPointerDown={() => setActiveTabIndex(0)}>Examples</Text>
            <Text fontSize="medium" padding="small none" minHeight={48} align="bottom left" style={{ opacity: activeTabIndex === 1 ? 1.0 : 0.4 }} onPointerDown={() => setActiveTabIndex(1)}>Reference</Text>
            <Text fontSize="medium" padding="small none" minHeight={48} align="bottom left" style={{ opacity: activeTabIndex === 2 ? 1.0 : 0.4 }} onPointerDown={() => setActiveTabIndex(2)}>History</Text>
          </Stack>
          <Divider />
          <View flex style={{ overflow: 'auto' }}>
            {activeTabIndex === 0 && (
              <View padding="small">
                {exampless.map((item, index) => (
                  <HistoryItem key={index} source={item.trim()} onItemSelect={(source: string) => (
                    interpret(source, setInputValue, setElementHistory, setInputHistory)
                  )} />
                ))}
              </View>
            )}
            {activeTabIndex === 1 && (
              <Stack>
                {reference.map(section => (
                  <>
                    <View fillColor="gray-2" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                      <Divider style={{ marginTop: -1 }} />
                      <View padding="small large">
                        <Spacer size="small" />
                        <Text caps fontSize="xxsmall" fontWeight="semibold" style={{ opacity: 0.6 }}>
                          {section.title}
                        </Text>
                      </View>
                      <Divider />
                    </View>
                    <View fillColor="white" padding="large">
                      <table style={{ borderSpacing: 0 }}>
                        <tbody>
                          {section.content.map(item => (
                            <tr>
                              <td style={{ paddingBottom: 8, verticalAlign: 'top' }}>
                                <Text style={{ fontFamily: 'Iosevka Fixed', whiteSpace: 'pre', userSelect: 'text' }}>
                                  {item.code.trim()}
                                </Text>
                              </td>
                              {item.label && (
                                <td style={{ paddingBottom: 8, paddingLeft: 16, verticalAlign: 'top' }}>
                                  <Text style={{}}>
                                    {item.label}
                                  </Text>
                                </td>
                              )}
                              {item.extra && (
                                <td style={{ width: 120, paddingBottom: 8, paddingLeft: 16, verticalAlign: 'top' }}>
                                  <Text style={{ fontFamily: 'Iosevka Fixed', whiteSpace: 'pre' }}>
                                    {item.extra}
                                  </Text>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </View>
                  </>
                ))}
              </Stack>
            )}
            {activeTabIndex === 2 && (
              <View padding="small large">
                {inputHistory.map(item => (
                  <Text align="left" paddingVertical="small" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT }}>
                    {item}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </Stack>
  );
};

export default React.memo(Terminal);
