import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import * as WebDAV from 'webdav';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';

import * as kopi from './kopi-language';

import { KopiAny, KopiArray, KopiNumber, KopiString, KopiTuple, KopiDate, KopiBoolean, KopiDict } from './kopi-language/src/classes';
import { KopiValue } from './kopi-language/src/types';

import exampless from './examples';
import reference from './reference';

import * as functions from './functions';

const MONOSPACE_FONT = 'Iosevka';

const webdavClient = WebDAV.createClient("https://webdav.mike-austin.com", {});

const Link = ({ children, ...props }: any) => {
  return (
    <Text textColor="blue-5" {...props} innerProps={{ style: { cursor: 'pointer' } }}>
      {children}
    </Text>
  );
};

class KopiEnv {
  static async inspect() {
    return Object.keys(environment).map(key => key.padEnd(12)).join('');
  }
}

let environment = {
  PI: new KopiNumber(Math.PI),
  E: new KopiNumber(Math.E),
  //
  Any: KopiAny,
  Tuple: KopiTuple,
  Array: KopiArray,
  String: KopiString,
  Number: KopiNumber,
  Boolean: KopiBoolean,
  Dict: KopiDict,
  Date: KopiDate,
  //
  env: KopiEnv,
  date: functions.KopiDateFunction,
  clock: functions.KopiClock,
  calendar: functions.KopiCalendar,
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
  //
  km: functions.kopi_meter,
  input: functions.kopi_input,
  export: functions.kopi_export,
  log: async (value: KopiValue) => console.log(await value.inspect()),
  open: async (filename: KopiString) => window.postMessage({ type: 'openFile', payload: `/${filename.value}` }),
  //
  ls: functions.KopiLs,
  cat: functions.kopi_cat,
  //
  element: functions.kopi_element,
  component: functions.kopi_component,
  View: functions.kopi_View,
  Text: functions.kopi_Text,
  Button: functions.kopi_Button,
};

const bind = (bindings: { [name: string]: KopiValue; }) => {
  const newEnvironment = { ...environment, ...bindings };

  environment = newEnvironment;
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
    Read <Link onClick={() => window.postMessage({ type: 'openFile', payload: '/Learning Kopi.md' })}>Learning Kopi</Link> for an introduction and to learn more.
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
