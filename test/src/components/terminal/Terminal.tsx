import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';

import { Button, Divider, Icon, Input, Spacer, Stack, Text, View, ViewProps } from 'bare';
import Clock from '../clock/Clock';

import * as kopi from './kopi-language';

import { KopiArray, KopiNumber, KopiString, KopiTuple } from './kopi-language/src/classes';
import { ASTNode, Context, Environment, KopiValue } from './kopi-language/src/types';

import historyItems from './examples';
import * as functions from './functions';

class Point extends KopiValue {
  x: KopiNumber;
  y: KopiNumber;

  constructor(x: KopiNumber, y: KopiNumber) {
    super();

    this.x = x;
    this.y = y;
  }
}

class Point_ extends KopiValue {
  async apply(thisArg: this, [tuple]: [KopiTuple]) {
    return new Point(await tuple[0] as KopiNumber, await tuple[1] as KopiNumber);
  }
}

class type_ extends KopiValue {
  async apply(thisArg: this, [tuple]: [KopiTuple]) {
    const class_ = class extends KopiValue {
      value: KopiValue;

      constructor(value: KopiValue) {
        super();

        this.value = value;
      }
    };

    Object.defineProperty(class_, 'name', {
      value: 'Person'
    });

    const Constructor = new class extends KopiValue {
      apply(thisArg: this, [value]: [KopiValue]) {
        return new class_(value);
      }
    }();

    Object.defineProperty(Constructor, 'name', {
      value: new KopiString('Person')
    });

    return Constructor;
  }
}

class KopiPrint_ extends KopiValue {
  async apply(thisArg: this, [value]: [KopiValue]) {
    return new KopiString(await value.toString());
  }
}

class KopiEval_ extends KopiValue {
  async apply(thisArg: this, [node, context]: [ASTNode, Context]) {
    const { evaluate, environment, bind } = context;

    return evaluate(node, environment, bind);
  }
}

class KopiReact_ extends KopiValue {
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
          return React.createElement(this.component, awaitedChild.props, await this.inspectChildren(awaitedChild.children.elements));
        }

        return React.createElement(this.component, awaitedChild.props) as any;
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

class KopiView_ extends KopiValue {
  async apply(thisArg: this, [props, context]: [KopiTuple, Context]) {

    const fillColor = await (props as any).fillColor;

    return (children: any) => {
      return new KopiReact_(View, {
        horizontal: true,
        fillColor: fillColor?.value,
        padding: 'large',
        style: { gap: 16 }
      }, children);
    };
  }
}

class KopiText_ extends KopiValue {
  async apply(thisArg: this, [props, context]: [KopiTuple, Context]) {
    const fillColor = await (props as any).fillColor;

    return (string: any) => {
      return new KopiReact_(Text, {
        fillColor: fillColor?.value,
        padding: 'small large',
      }, string);
    };
  }
}

let environment = new Environment({
  Point: new Point_(),
  View: new KopiView_(),
  Text: new KopiText_(),
  type: new type_(),
  eval: new KopiEval_(),
  PI: new KopiNumber(Math.PI),
  E: new KopiNumber(Math.E),
  print: new KopiPrint_(),
  let: new functions.KopiLet(),
  loop: new functions.KopiLoopFunction(),
  match: new functions.KopiMatch(),
  apply: new functions.KopiApply(),
  ident: new functions.KopiIdent(),
  date: new functions.KopiDate(),
  sleep: new functions.KopiSleep(),
  clock: new functions.KopiClock(),
  calendar: new functions.KopiCalendar(),
  icon: new functions.KopiIcon(),
  fetch: new functions.KopiFetch(),
  random: new functions.KopiRandom(),
  repeat: new functions.KopiRepeat(),
  km: new functions.KopiMeter(),
  spawn: new functions.KopiSpawn(),
  context: new functions.KopiContextFunction(),
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
    <Text padding="small" className={styles.Item} style={{ whiteSpace: 'pre' }} onClick={() => onItemSelect(source)}>
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
  const eventTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const eventCount = useRef(0);

  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<React.ReactElement[]>(initialHistory);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

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
            <Text fontSize="medium">Examples</Text>
          </View>
          <Divider />
          <View padding="small" style={{ overflow: 'auto' }}>
            {historyItems.map((item, index) => (
              <HistoryItem key={index} source={item.trim()} onItemSelect={(source: string) => (
                interpret(source, setInputValue, setHistory)
              )} />
            ))}
          </View>
        </View>
      )}
    </Stack>
  );
};

export default Terminal;
