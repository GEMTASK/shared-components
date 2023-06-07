import React, { useContext } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import View from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

const Chip = () => {
  return (
    <Text caps fontSize="small" fillColor="gray-3" align="middle left" paddingHorizontal="small" style={{ borderRadius: 1000, height: 24 }}>
      Chip
    </Text>
  );
};

const chips = ['One', 'Two', 'Three'];

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
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Input = ({
  label,
}: InputProps) => {
  const innerStyles = useInnerStyles();

  return (
    <View>
      {!!label && (
        <>
          <Text caps fontSize="xxsmall" fontWeight="semibold" textColor="gray-6">{label}</Text>
          <Spacer size="small" />
        </>
      )}
      <View horizontal fillColor="white" paddingVertical="xsmall" paddingHorizontal="medium" className={innerStyles.Inner}>
        {chips.map(chip => (
          <Chip />
        ))}
        <View as="input" style={{ appearance: 'none', background: 'none', padding: 0, border: 'none', outline: 'none', borderRadius: 2, flex: 1, height: 24, lineHeight: 20, fontSize: 14 }} />
      </View>
    </View>
  );
};

export default Input;
