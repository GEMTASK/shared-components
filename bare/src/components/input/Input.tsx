import React, { useContext } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

type ChipProps = {
  label: string,
};

const Chip = ({
  label
}: ChipProps) => {
  return (
    <Text fontSize="small" fillColor="gray-3" align="middle left" paddingHorizontal="small" style={{ borderRadius: 1000, height: 24 }}>
      {label}
    </Text>
  );
};

const useInnerStyles = createUseStyles({
  Inner: {
    gap: 4,
    flexWrap: 'wrap',
    minHeight: 32,
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[4]}`,
    borderRadius: 2.5,
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`,
    }
  },
});

type InputProps = {
  type?: 'text' | 'date' | 'color',
  chips?: string[],
  onChange?: (value: string) => void,
} & Omit<ViewProps<'input'>, 'children' | 'onChange'>;

const Input = ({
  type = 'text',
  chips,
  onChange,
  ...props
}: InputProps) => {
  const innerStyles = useInnerStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const inputElement = (() => {
    switch (type) {
      case 'date': return (
        <input
          type="date"
          style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }}
          onChange={handleChange}
          {...props}
        />
      );
      case 'color': return (
        <input
          type="color"
          style={{ appearance: 'none', background: 'none', padding: 0, margin: 0, border: 'none', outline: 'none', width: '100%', minHeight: 32 }}
          onChange={handleChange}
          {...props}
        />
      );
      default: return (
        <input
          type={type}
          style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }}
          onChange={handleChange}
          {...props}
        />
      );
    }
  })();

  return (
    <View horizontal fillColor="white" paddingHorizontal="medium" className={innerStyles.Inner}>
      {/* {chips && chips.map((chip, index) => (
          <Chip key={index} label={chip} />
        ))} */}
      {inputElement}
    </View>
  );
};

export default Input;
