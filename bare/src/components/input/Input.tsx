import React, { useContext } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import View from '../view/index.js';
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
  label?: string,
  type?: 'date' | 'color',
  chips?: string[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Input = ({
  label,
  type,
  chips,
}: InputProps) => {
  const innerStyles = useInnerStyles();

  const inputElement = (() => {
    switch (type) {
      case 'date': return (
        <input type="date" style={{ background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2, flex: 1, height: 24, lineHeight: 20, fontSize: 14, fontFamily: 'Open Sans' }} />
      );
      default: return (
        <input type={type} style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2, flex: 1, height: 24, lineHeight: 20, fontSize: 14, fontFamily: 'Open Sans' }} />
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
      <View horizontal fillColor="white" paddingVertical="xsmall" paddingHorizontal="medium" className={innerStyles.Inner}>
        {chips && chips.map((chip, index) => (
          <Chip key={index} label={chip} />
        ))}
        {inputElement}
      </View>
    </View>
  );
};

export default Input;
