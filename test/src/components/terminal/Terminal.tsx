import { useLayoutEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { Icon, Input, Spacer, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';
import { TextProps } from 'bare/dist/components/text/Text';

import { interpret, inspect } from './kopi-language';

type LinkProps = TextProps<'a'> & React.ComponentProps<typeof RouterLink>;

const Link = ({
  children,
  to,
  target,
  ...props
}: LinkProps) => {
  return (
    <Text inner={RouterLink} innerProps={{ to, target }} textColor="blue-5" {...props}>
      {children}
    </Text>
  );
};

const Line = ({
  children,
}: {
} & ViewProps) => {
  return (
    <View horizontal align="left" paddingVertical="xsmall">
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
    <Text as="code" align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }} >
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
          <Text as="code" style={{ whiteSpace: 'pre-wrap' }}>{value}</Text>
        </Line>
      ]);

      if (value) {
        let element: React.ReactNode = 'Command not found';
        const [command, arg] = value.split(' ');

        switch (command) {
          case 'date':
            element = new Date().toLocaleString();
            break;
          case 'icon':
            element = <Icon icon={arg as any} size="3x" />;
            break;
          case 'clock':
            element = <Clock style={{ width: 150 }} />;
        }

        setValue('');

        element = await (await interpret(value)).inspect();

        setHistory(history => [
          ...history,
          <View horizontal>
            <ErrorBoundary fallback={<Text>Error</Text>} onError={() => console.log('here')}>
              {typeof element === 'string' ? (
                <Text as="code" align="left" paddingVertical="xsmall" style={{ whiteSpace: 'pre-wrap' }}>{element}</Text>
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
        <Input ref={inputElementRef} flush icon="angle-right" value={value} style={{ fontFamily: 'monospace' }} onChange={handleInputChange} onKeyDown={handleInputKeyDown} />
      </View>
      <Spacer size="small" />
    </View>
  );
};

export default Terminal;
