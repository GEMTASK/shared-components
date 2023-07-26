import { useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps, createLink } from 'bare';
import Clock from '../clock/Clock';

import { interpret, inspect } from './kopi-language';
import { KopiFunction, KopiNumber, KopiString, KopiTuple } from './kopi-language/src/classes';
import { Context, Environment, KopiValue } from './kopi-language/src/types';

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
    return func.apply(KopiTuple.empty, [KopiTuple.empty, context]);
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

class KopiIcon extends KopiValue {
  async inspect() {
    return <Icon icon="house" size="3x" />;
  }
}

//

const environment = new Environment({
  x: new KopiNumber(3),
  let: new KopiLet(),
  date: new KopiDate(),
  sleep: new KopiSleep(),
  clock: new KopiClock(),
  icon: new KopiIcon(),
  fetch: new KopiFetch(),
});

const HistoryLine = ({
  children,
  ...props
}: ViewProps) => {
  return (
    <View horizontal align="left" paddingVertical="xsmall" {...props}>
      <Icon icon="angle-right" />
      <Spacer size="xsmall" />
      {children}
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
    <Text padding="small" onClick={() => onItemSelect(source)}>
      {source}
    </Text>
  );
};

const historyItems = [
  `date`,
  `clock`,
  `1 + 2 * 3`,
  `(1 + 2) * 3`,
  `sleep 5 + sleep 5`,
  `((a, b) => a + b) (1, 2)`,
  `((a, b = 2) => a + b) 1`,
  `((a = 1, b = 2) => a + b) ()`,
  `let (a = 1) => a`,
  `let (a = 1, b = 2) => a + b`,
  `'sin (45 * (3.14159 / 180))`,
  `'cos (45 * (3.14159 / 180))`,
  `fetch "robots.txt"`,
];

const Terminal = ({ ...props }: any) => {
  const historyElementRef = useRef<HTMLElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);

  const [value, setValue] = useState('');
  const [history, setHistory] = useState<React.ReactElement[]>([
    <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
      Kopi shell – a simple, immutable, async programming langauge.<br />
      Type a command such as "date", "clock", or "icon".
    </Text>,
    <Clock style={{ width: 150 }} />
  ]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useLayoutEffect(() => {
    if (historyElementRef.current) {
      historyElementRef.current.scrollTop = historyElementRef.current.scrollHeight;
    }
  }, [history]);

  const handleInputKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setHistory(history => [
        ...history,
        <HistoryLine>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
        </HistoryLine>
      ]);

      if (value.length !== 0) {
        let element: string | React.ReactElement = 'Command not found';

        setValue('');

        try {
          element = await (await interpret(value, environment)).inspect();
        } catch (error) {
          console.warn((error as any).location);

          element = (error as Error).message;
        }

        setHistory(history => [
          ...history,
          <View horizontal>
            {typeof element === 'string' ? (
              <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
                {element}
              </Text>
            ) : (
              element
            )}
          </View>
        ]);
      }
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

  const handleHistorySelect = async (source: string) => {
    let element: string | React.ReactElement = 'Command not found';

    setHistory(history => [
      ...history,
      <HistoryLine>
        <Text style={{ whiteSpace: 'pre-wrap' }}>{source}</Text>
      </HistoryLine>
    ]);

    try {
      element = await (await interpret(source, environment)).inspect();
    } catch (error) {
      console.warn((error as any).location);

      element = (error as Error).message;
    }

    setHistory(history => [
      ...history,
      <View horizontal>
        {typeof element === 'string' ? (
          <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>
            {element}
          </Text>
        ) : (
          element
        )}
      </View>
    ]);
  };

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
          {history.map(item => (
            item
          ))}
        </View>
        <View horizontal align="left" paddingHorizontal="small" style={{ marginTop: -5 }}>
          <Input ref={inputElementRef} flush icon="angle-right" value={value} onChange={handleInputChange} onKeyDown={handleInputKeyDown} />
        </View>
        <Spacer size="small" />
      </View>
      {isHistoryVisible && (
        <View>
          <View fillColor="gray-1" padding="small large" minHeight={48} align="bottom left">
            <Text fontSize="medium">History</Text>
          </View>
          <Divider />
          <View padding="small">
            {historyItems.map(item => (
              <HistoryItem source={item} onItemSelect={handleHistorySelect} />
            ))}
          </View>
        </View>
      )}
    </Stack>
  );
};

export default Terminal;
