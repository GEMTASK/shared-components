import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';

import kopi, { Environment, Context, KopiValue, KopiAny, KopiString, KopiTuple, KopiArray, getSymbol } from 'kopi-language';

import exampless from './examples';
import reference from './reference';

import * as functions from './functions';

declare global {
  var environment: { [key: string | symbol]: any; };
}

const MONOSPACE_FONT = 'Iosevka';

const Link = ({ children, ...props }: any) => {
  return (
    <Text textColor="blue-5" {...props} innerProps={{ style: { cursor: 'pointer' } }}>
      {children}
    </Text>
  );
};

class KopiEnv {
  static async inspect() {
    return Object.getOwnPropertySymbols(environment).map(({ description }) => description?.padEnd(12)).join('');
  }
}

window.environment = {
  Any: KopiAny,
  Array: KopiArray,
  Tuple: KopiTuple,
};

let environment: Environment = {
  [getSymbol('env')]: KopiEnv,
  [getSymbol('date')]: functions.KopiDateFunction,
  [getSymbol('clock')]: functions.KopiClock,
  [getSymbol('calendar')]: functions.KopiCalendar,
  //
  [getSymbol('km')]: functions.kopi_meter,
  [getSymbol('input')]: functions.kopi_input,
  [getSymbol('export')]: functions.kopi_export,
  [getSymbol('log')]: async (value: KopiValue) => console.log(await value.inspect()),
  [getSymbol('open')]: async (filename: KopiString) => window.postMessage({
    type: 'openFile',
    payload: `/${filename.value}`
  }),
  //
  [getSymbol('ls')]: functions.KopiLs,
  [getSymbol('cat')]: functions.kopi_cat,
};

(async () => {
  const {
    kopi_element,
    kopi_component,
    kopi_requestAnimationFrame,
    kopi_requestDebugAnimationFrame,
    kopi_View,
    kopi_Text,
    kopi_Button,
    kopi_Svg,
    kopi_Circle,
  } = await import('./functions/react');

  environment = {
    ...environment,
    [getSymbol('element')]: kopi_element,
    [getSymbol('component')]: kopi_component,
    [getSymbol('requestAnimationFrame')]: kopi_requestAnimationFrame,
    [getSymbol('requestDebugAnimationFrame')]: kopi_requestDebugAnimationFrame,
    [getSymbol('View')]: kopi_View,
    [getSymbol('Text')]: kopi_Text,
    [getSymbol('Button')]: kopi_Button,
    [getSymbol('Svg')]: kopi_Svg,
    [getSymbol('Circle')]: kopi_Circle,
  };
})();

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

//
// Value
//

const Value = ({
  promise
}: {
  promise: Promise<React.ReactElement | undefined>;
}) => {
  const [element, setValue] = useState<React.ReactElement | null>(
    <View minHeight={20} align="center">
      <Icon icon="spinner" spin />
    </View>
  );

  useEffect(() => {
    (async () => {
      const element = await promise;

      setValue(element ?? null);
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

  const promise = new Promise<React.ReactElement | undefined>(async (resolve, reject) => {
    try {
      async function kopi_print(value: KopiValue) {
        const string = await value.toNativeString();

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
      }

      async function kopi_import(url: KopiString, context: Context) {
        if (url.value.endsWith('.js')) {
          const module = await import(/*webpackIgnore: true*/ `//webdav.mike-austin.com/${url.value}?${Date.now()}`);

          const [fields, names] = Object.entries(module).reduce(([fields, names], [name, value]) => {
            return [
              [...fields, value],
              [...names, name]
            ];
          }, [[] as any, [] as any]);

          return new KopiTuple(fields, names);
        }

        const source = await (await fetch(`//webdav.mike-austin.com/${url.value}`)).text();

        if (typeof source === 'string') {
          return kopi.interpret(source, { ...environment, print: kopi_print, import: kopi_import });
        }
      }

      const value = await kopi.interpret(source, { ...environment, print: kopi_print, import: kopi_import });

      if (value !== undefined) {
        const element = await value.inspect();

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
      resolve(
        <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap', fontFamily: MONOSPACE_FONT, userSelect: 'text' }}>
          {(error as Error).message}
        </Text>
      );

      throw error;
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
    Read <Link onClick={() => window.postMessage({ type: 'openFile', payload: '/Learning Kopi.md' })}>Learning Kopi</Link> for an introduction and to learn more.
  </Text>
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
        <View horizontal padding="small" fillColor="gray-1">
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
                              {item.label !== undefined && (
                                <td style={{ paddingBottom: 8, paddingLeft: 16, verticalAlign: 'top' }}>
                                  <Text style={{}}>
                                    {item.label}
                                  </Text>
                                </td>
                              )}
                              {item.extra !== undefined && (
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
