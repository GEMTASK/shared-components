import React, { useContext, useState } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import { pick, omit } from 'rambda';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';
import Popup from '../popup/index.js';
import Button from '../button/index.js';
import Icon from '../icon/Icon.js';
import clsx from 'clsx';

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
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[3]}`,
    borderRadius: 2.5,
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`,
    }
  },
  flush: {
    boxShadow: 'none',
    borderRadius: 0,
    '&:focus-within': {
      boxShadow: 'none',
      '&::before': {
        borderBottom: `2px solid ${OpenColor.blue[5]}`,
      }
    },
    '&::before': {
      boxShadow: 'none',
      content: '""',
      position: 'absolute',
      inset: 0,
      borderBottom: `1px solid ${OpenColor.gray[3]}`,
      pointerEvents: 'none',
    }
  }
});

type InputProps = {
  type?: 'text' | 'number' | 'date' | 'color',
  icon?: React.ComponentProps<typeof Icon>['icon'],
  chips?: string[],
  value?: string,
  lines?: number,
  flush?: boolean,
  options?: { [value: string]: string; },
  placeholder?: string,
  onChange?: (value: string) => void,
} & Omit<ViewProps<'input'>, 'children' | 'onChange'>;

const Input = ({
  type = 'text',
  icon,
  chips,
  value,
  lines,
  flush,
  options,
  placeholder,
  onChange,
  onBlur,
  ...props
}: InputProps) => {
  const innerStyles = useInnerStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      case 'number': return (
        <input
          type="text"
          value={value}
          style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans', textAlign: 'right', width: '100%' }}
          onChange={handleInputChange}
        />
      );
      case 'date': return (
        <input
          type="date"
          value={value}
          style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }}
          onChange={handleInputChange}
        />
      );
      case 'color': return (
        <input
          type="color"
          value={value}
          style={{ appearance: 'none', background: 'none', padding: 0, margin: 0, border: 'none', outline: 'none', width: '100%', minHeight: 32 }}
          onChange={handleInputChange}
        />
      );
      default: return lines && lines > 1 ? (
        <textarea
          value={value}
          rows={lines}
          placeholder={placeholder}
          style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans', width: '100%' }}
          onChange={handleTextAreaChange}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2.5, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans', width: '100%' }}
          onChange={handleInputChange}
          onBlur={onBlur}
        />
      );
    }
  })();

  const elementClassName = clsx(
    innerStyles.Inner,
    flush && innerStyles.flush,
  );

  return (
    <Popup
      flex
      element={
        <View horizontal align="left" fillColor={!flush ? 'white' : undefined} paddingHorizontal={!flush ? 'medium' : undefined} className={elementClassName} {...props}>
          {icon && (
            <Icon icon={icon} />
          )}
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
