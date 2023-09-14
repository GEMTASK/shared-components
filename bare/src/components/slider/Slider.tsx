import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Input from '../input/index.js';
import Spacer from '../spacer/Spacer.js';
import { useEffect, useRef, useState } from 'react';

const useStyles = createUseStyles({
  Inner: {
    appearance: 'none',
    flex: 1,
    background: OpenColor.gray[4],
    // boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.15)',
    borderRadius: 1000,
    padding: 0,
    margin: 0,
    marginTop: 8,
    marginBottom: 8,
    height: 6,
    // '&::-webkit-slider-runnable-track': {
    //   background: OpenColor.gray[3],
    //   borderRadius: 1000,
    //   height: 8,
    // },
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      background: 'white',
      width: 24,
      height: 24,
      borderRadius: 1000,
      boxShadow: 'inset 0 0 0 1px hsla(0, 0%, 0%, 0.1)',
    }
  }
});

type SliderProps = {
  value: number,
  max?: number,
  onInput?: ViewProps['onInput'],
  onValueChange?: (value: number) => void,
} & ViewProps;

const Slider = ({
  value,
  max,
  onInput,
  onValueChange,
  ...props
}: SliderProps) => {
  const inputElementRef = useRef<HTMLInputElement>(null);
  const internalValueRef = useRef(value);

  const styles = useStyles();

  function handleRangeInput(this: HTMLInputElement) {
    internalValueRef.current = Number(this.value);

    if (inputElementRef.current) {
      inputElementRef.current.value = this.value;
    }
  };

  function handleRangeChange(this: HTMLInputElement) {
    onValueChange?.(Number(this.value));
  };

  useEffect(() => {
    if (inputElementRef.current) {
      inputElementRef.current.addEventListener('input', handleRangeInput);
      inputElementRef.current.addEventListener('change', handleRangeChange);

      inputElementRef.current.value = String(value);
    }
  }, []);

  return (
    <View flex horizontal align="left" {...props}>
      {/* <Input type="number" value={`${value}`} style={{ width: 60 }} />
      <Spacer size="small" /> */}
      <input
        ref={inputElementRef}
        type="range"
        value={value}
        max={max}
        className={styles.Inner}
        onInput={onInput}
      />
    </View>
  );
};

export default Slider;
