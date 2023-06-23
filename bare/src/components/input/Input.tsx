import React, { useContext, useState } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';
import Popup from '../popup/index.js';
import Button from '../button/index.js';

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

const Option = ({ value, onSelect }: any) => {
  const handleClick = () => {
    onSelect?.(value);
  };

  return (
    <Button hover title={value} titleFontWeight="normal" align="left" onClick={handleClick} />
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
  value?: string,
  options?: { [value: string]: string; },
  onChange?: (value: string) => void,
} & Omit<ViewProps<'input'>, 'children' | 'onChange'>;

const Input = ({
  type = 'text',
  chips,
  value,
  options,
  onChange,
  ...props
}: InputProps) => {
  const innerStyles = useInnerStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleOptionSelect = (value: string) => {
    console.log('handleOptionSelect', value);

    if (onChange) {
      onChange(value);
    }
  };

  const inputElement = (() => {
    switch (type) {
      case 'date': return (
        <input
          type="date"
          value={value}
          style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }}
          onChange={handleChange}
          {...props}
        />
      );
      case 'color': return (
        <input
          type="color"
          value={value}
          style={{ appearance: 'none', background: 'none', padding: 0, margin: 0, border: 'none', outline: 'none', width: '100%', minHeight: 32 }}
          onChange={handleChange}
          {...props}
        />
      );
      default: return (
        <input
          type={type}
          value={value}
          style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }}
          onChange={handleChange}
          {...props}
        />
      );
    }
  })();

  return (
    <Popup
      element={
        <View horizontal fillColor="white" paddingHorizontal="medium" className={innerStyles.Inner}>
          {/* {chips && chips.map((chip, index) => (
            <Chip key={index} label={chip} />
          ))} */}
          {inputElement}
        </View>
      }
      padding="small none"
    >
      {options && Object.entries(options).map(([value], index) => (
        <Option key={index} value={value} onSelect={handleOptionSelect} />
      ))}
    </Popup>
  );
};

export default Input;
