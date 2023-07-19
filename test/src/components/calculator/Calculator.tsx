import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const Buttons = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'
] as const;

const Operations = {
  ADD: (a: number, b: number) => a + b,
  SUBTRACT: (a: number, b: number) => a - b,
  MULTIPLY: (a: number, b: number) => a * b,
  DIVIDE: (a: number, b: number) => a / b,
};

type State = {
  op: keyof typeof Operations,
  replace: boolean,
  value: number,
  display: string,
};

// typeof number toString

type Action =
  | { type: 'NUMBER', payload: typeof Buttons[number]; }
  | { type: 'OPERATOR', payload: keyof typeof Operations; }
  | { type: 'EQUALS'; }
  | { type: 'CLEAR'; };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CLEAR': {
      return {
        op: 'ADD',
        replace: true,
        value: 0,
        display: '0',
      };
    }
    case 'NUMBER': {
      return {
        ...state,
        replace: false,
        display: state.replace
          ? action.payload
          : state.display + action.payload,
      };
    }
    case 'OPERATOR': {
      const value = !state.replace
        ? Operations[state.op](state.value, Number(state.display))
        : state.value;

      return {
        op: action.payload,
        replace: true,
        value: value,
        display: value.toString().slice(0, 12),
      };
    }
    case 'EQUALS': {
      const value = !state.replace
        ? Operations[state.op](state.value, Number(state.display))
        : state.value;

      return {
        op: 'ADD',
        replace: true,
        value: value,
        display: value.toString().slice(0, 12),
      };
    }
  }
};

const CalcButton = ({ title, onClick, ...props }: any) => {
  return (
    <Button solid title={title} minWidth={0} minHeight={0} onClick={onClick} {...props} />
  );
};

const Calculator = ({ ...props }: any) => {
  const [{ display }, dispatch] = useReducer(reducer, { op: 'ADD', replace: true, value: 0, display: '0' });

  const NumberPress = (number: typeof Buttons[number]) => dispatch({ type: 'NUMBER', payload: number });
  const OperatorPress = (operator: keyof typeof Operations) => dispatch({ type: 'OPERATOR', payload: operator });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '.':
        return NumberPress(event.key);
      case '+':
        return OperatorPress('ADD');
      case '-':
        return OperatorPress('SUBTRACT');
      case '*':
        return OperatorPress('MULTIPLY');
      case '/':
        return OperatorPress('DIVIDE');
    }
  };

  return (
    <View {...props}>
      <Text fontSize="xlarge" textAlign="right" padding="large large" fillColor="white" style={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
        {display}
      </Text>
      <Divider />
      <Grid
        flex
        tabIndex={0}
        fillColor="gray-1"
        padding="small"
        columns={4}
        gap={8}
        style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
        onKeyDown={handleKeyDown}
      >
        <CalcButton title="C" onClick={() => dispatch({ type: 'CLEAR' })} />
        <CalcButton title="÷" onClick={() => OperatorPress('DIVIDE')} />
        <CalcButton title="×" onClick={() => OperatorPress('MULTIPLY')} />
        <CalcButton title="−" onClick={() => OperatorPress('SUBTRACT')} />
        <CalcButton title="7" onClick={() => NumberPress('7')} />
        <CalcButton title="8" onClick={() => NumberPress('8')} />
        <CalcButton title="9" onClick={() => NumberPress('9')} />
        <CalcButton title="+" style={{ gridColumnStart: 4, gridRow: '2 / 4' }} onClick={() => OperatorPress('ADD')} />
        <CalcButton title="4" onClick={() => NumberPress('4')} />
        <CalcButton title="5" onClick={() => NumberPress('5')} />
        <CalcButton title="6" onClick={() => NumberPress('6')} />
        <CalcButton title="1" onClick={() => NumberPress('1')} />
        <CalcButton title="2" onClick={() => NumberPress('2')} />
        <CalcButton title="3" onClick={() => NumberPress('3')} />
        <CalcButton title="=" style={{ gridColumnStart: 4, gridRow: '4 / 6' }} onClick={() => dispatch({ type: 'EQUALS' })} />
        <CalcButton title="0" style={{ gridColumn: '1 / 3' }} onClick={() => NumberPress('0')} />
        <CalcButton title="." onClick={() => NumberPress('.')} />
      </Grid>
    </View>
  );
};

export default Calculator;
