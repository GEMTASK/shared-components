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
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[3]}`,
    borderRadius: 2,
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`,
    }
  },
});

type InputProps = {
  type?: 'text' | 'date' | 'color',
  label?: string,
  chips?: string[],
} & Omit<ViewProps<'input'>, 'children'>;

const Input = ({
  type,
  label,
  chips,
  ...props
}: InputProps) => {
  const innerStyles = useInnerStyles();

  const inputElement = (() => {
    switch (type) {
      case 'date': return (
        <input type="date" style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }} {...props} />
      );
      case 'color': return (
        <input type="color" style={{ appearance: 'none', background: 'none', padding: 0, margin: 0, border: 'none', outline: 'none', width: '100%', minHeight: 32 }} {...props} />
      );
      default: return (
        <input type={type} style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2, flex: 1, lineHeight: '20px', fontSize: 14, fontFamily: 'Open Sans' }} {...props} />
      );
    }
  })();

  return (
    <View>
      {!!label && (
        <>
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">{label}</Text>
          <Spacer size="small" />
        </>
      )}
      <View horizontal fillColor="white" /*paddingVertical="xsmall"*/ paddingHorizontal="medium" className={innerStyles.Inner}>
        {/* {chips && chips.map((chip, index) => (
          <Chip key={index} label={chip} />
        ))} */}
        {inputElement}
      </View>
    </View>
  );
};

export default Input;
