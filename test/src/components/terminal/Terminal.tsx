import { useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Icon, Input, Spacer, Text, View, ViewProps, createLink } from 'bare';
import Clock from '../clock/Clock';

import { interpret, inspect } from './kopi-language';
import { KopiFunction, KopiNumber, KopiTuple } from './kopi-language/src/classes';
import { Context, Environment, KopiValue } from './kopi-language/src/types';

class Inspectable extends KopiValue {
  func: () => Promise<string | React.ReactElement>;

  constructor(func: () => Promise<string | React.ReactElement>) {
    super();

    this.func = func;
  }

  async inspect() {
    return this.func();
  }
}

class NativeFunction extends KopiValue {
  func: (...args: any[]) => Promise<KopiValue>;

  constructor(func: (...args: any[]) => Promise<KopiValue>) {
    super();

    this.func = func;
  }

  async apply(thisArg: this, [argument, context]: [KopiValue, Context]) {
    return this.func.apply(thisArg, [argument, context]);
  }
}

const environment = new Environment({
  x: new KopiNumber(3),
  let: new NativeFunction((func: KopiFunction, context: Context) => {
    return func.apply(KopiTuple.empty, [KopiTuple.empty, context]);
  }),
  date: {
    inspect: async () => new Date().toLocaleString(),
    get fields() { return [Promise.resolve(this)]; }
  },
  date2: new Inspectable(async () => new Date().toLocaleString()),
  async sleep(number: KopiNumber) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  },
  sleep2: new NativeFunction((number: KopiNumber) => new Promise((resolve) => {
    setTimeout(() => resolve(number), number.value * 1000);
  })),
  clock: {
    inspect: async () => <Clock style={{ width: 150 }} />,
    get fields() { return [Promise.resolve(this)]; }
  }
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
