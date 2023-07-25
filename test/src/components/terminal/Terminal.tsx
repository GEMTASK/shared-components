import { useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Icon, Input, Spacer, Text, View, ViewProps, createLink } from 'bare';
import Clock from '../clock/Clock';

import { interpret, inspect } from './kopi-language';
import { KopiFunction, KopiNumber, KopiTuple } from './kopi-language/src/classes';
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

class KopiClock extends KopiValue {
  async inspect() {
    return <Clock style={{ width: 150 }} />;
  }
}

const environment = new Environment({
  x: new KopiNumber(3),
  let: new KopiLet(),
  date: new KopiDate(),
  sleep: new KopiSleep(),
  clock: new KopiClock(),
});

const Link = createLink(RouterLink);

const Line = ({
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

const Terminal = ({ ...props }: any) => {
  const historyElementRef = useRef<HTMLElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  const firstEventRef = useRef<React.PointerEvent | null>(null);

  const [value, setValue] = useState('');
  const [history, setHistory] = useState<React.ReactElement[]>([
    <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }} >
      Type a command such as "date", "clock", or "icon house" or any free icon from{' '}
      <Link to="http://fontawesome.com/search?o=r&m=free" target="_blank">fontawesome.com</Link>
    </Text>,
    <Clock style={{ width: 150 }} />
  ]);

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
        <Line>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
        </Line>
      ]);

      if (value) {
        let element: React.ReactNode = 'Command not found';
        const [command, arg] = value.split(' ');

        switch (command) {
          case 'icon':
            element = <Icon icon={arg as any} size="3x" />;
            break;
        }

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
            <ErrorBoundary fallback={<Text>Error</Text>} onError={() => console.log('here')}>
              {typeof element === 'string' ? (
                <Text align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>{element}</Text>
              ) : (
                element
              )}
            </ErrorBoundary>
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

  return (
    <View {...props} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
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
  );
};

export default Terminal;
