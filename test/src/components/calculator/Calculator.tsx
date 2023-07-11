import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const NumberPress = (number: number) => ({
  type: 'NUMBER',
  payload: number,
});

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
  | { type: 'NUMBER', payload: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.'; }
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
        display: value.toString(10),
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
        display: value.toString(),
      };
    }
  }
};

const Calculator = () => {
  const [{ value, display }, dispatch] = useReducer(reducer, { op: 'ADD', replace: true, value: 0, display: '0' });

  return (
    <>
      <Text fontSize="xlarge" textAlign="right" padding="large small" fillColor="white">
        {display}
      </Text>
      <Divider />
      <Grid flex fillColor="gray-1" padding="small" columns={4} style={{ gap: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Button solid title="C" minWidth={50} onClick={() => dispatch({ type: 'CLEAR' })} />
        <Button solid title="÷" minWidth={50} onClick={() => dispatch({ type: 'OPERATOR', payload: 'DIVIDE' })} />
        <Button solid title="×" minWidth={50} onClick={() => dispatch({ type: 'OPERATOR', payload: 'MULTIPLY' })} />
        <Button solid title="−" minWidth={50} onClick={() => dispatch({ type: 'OPERATOR', payload: 'SUBTRACT' })} />
        <Button solid title="7" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '7' })} />
        <Button solid title="8" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '8' })} />
        <Button solid title="9" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '8' })} />
        <Button solid title="+" minWidth={50} style={{ gridColumnStart: 4, gridRow: '2 / 4' }} onClick={() => dispatch({ type: 'OPERATOR', payload: 'ADD' })} />
        <Button solid title="4" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '4' })} />
        <Button solid title="5" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '5' })} />
        <Button solid title="6" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '6' })} />
        <Button solid title="1" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '1' })} />
        <Button solid title="2" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '2' })} />
        <Button solid title="3" minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '3' })} />
        <Button solid title="=" minWidth={50} style={{ gridColumnStart: 4, gridRow: '4 / 6' }} onClick={() => dispatch({ type: 'EQUALS' })} />
        <Button solid title="0" minWidth={50} style={{ gridColumn: '1 / 3' }} onClick={() => dispatch({ type: 'NUMBER', payload: '0' })} />
        <Button solid title="." minWidth={50} onClick={() => dispatch({ type: 'NUMBER', payload: '.' })} />
      </Grid>
    </>
  );
};

export default Calculator;
