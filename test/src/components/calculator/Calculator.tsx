import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { View, Text, Image, Button, Spacer, Divider, Stack, Grid } from 'bare';
import { ViewProps } from 'bare/dist/components/view';

const NumberPress = (number: number) => ({
  type: 'NUMBER',
  payload: number,
});

type State = {
  replace: boolean,
  value: number,
  display: string,
};

// typeof number toString

type Action =
  | { type: 'NUMBER', payload: '7' | '8' | '9'; }
  | { type: 'OPERATOR', payload: '+'; }
  | { type: 'CLEAR'; };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'CLEAR': {
      return {
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
      const value = state.value + Number(state.display);

      return {
        ...state,
        replace: true,
        value: value,
        display: value.toString(),
      };
    }
  }
  return state;
};

const Calculator = () => {
  const [{ value, display }, dispatch] = useReducer(reducer, { replace: true, value: 0, display: '0' });

  return (
    <>
      <Text fontSize="xlarge" textAlign="right" padding="large small" fillColor="white">
        {display}
      </Text>
      <Divider />
      <Grid flex fillColor="gray-1" padding="small" columns={4} style={{ gap: 8, borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }}>
        <Button solid title="C" style={{ minWidth: 0 }} onClick={() => dispatch({ type: 'CLEAR' })} />
        <Button solid title="÷" style={{ minWidth: 0 }} />
        <Button solid title="×" style={{ minWidth: 0 }} />
        <Button solid title="−" style={{ minWidth: 0 }} />
        <Button solid title="7" style={{ minWidth: 0 }} onClick={() => dispatch({ type: 'NUMBER', payload: '7' })} />
        <Button solid title="8" style={{ minWidth: 0 }} onClick={() => dispatch({ type: 'NUMBER', payload: '8' })} />
        <Button solid title="9" style={{ minWidth: 0 }} />
        <Button solid title="+" style={{ minWidth: 0, gridColumnStart: 4, gridRow: '2 / 4' }} onClick={() => dispatch({ type: 'OPERATOR', payload: '+' })} />
        <Button solid title="4" style={{ minWidth: 0 }} />
        <Button solid title="5" style={{ minWidth: 0 }} />
        <Button solid title="6" style={{ minWidth: 0 }} />
        <Button solid title="1" style={{ minWidth: 0 }} />
        <Button solid title="2" style={{ minWidth: 0 }} />
        <Button solid title="3" style={{ minWidth: 0 }} />
        <Button solid title="=" style={{ minWidth: 0, gridColumnStart: 4, gridRow: '4 / 6' }} />
        <Button solid title="0" style={{ minWidth: 0, gridColumn: '1 / 3' }} />
        <Button solid title="." style={{ minWidth: 0 }} />
      </Grid>
    </>
  );
};

export default Calculator;
