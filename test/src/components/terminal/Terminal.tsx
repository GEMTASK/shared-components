import { useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Icon, Input, Spacer, Text, View, ViewProps, createLink } from 'bare';
import Clock from '../clock/Clock';

import { interpret, inspect } from './kopi-language';
import { KopiNumber } from './kopi-language/src/classes';

const environment = {
  x: new KopiNumber(3),
  date: {
    inspect: async () => new Date().toLocaleString()
  },
  async sleep(number: KopiNumber) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(number), number.value * 1000);
    });
  },
  clock: {
    inspect: async () => <Clock style={{ width: 150 }} />
  }
};

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

  const handlePointerDown = () => {
    setTimeout(() => {
      inputElementRef.current?.focus();
    });
  };

  return (
    <View {...props} onPointerDown={handlePointerDown}>
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
