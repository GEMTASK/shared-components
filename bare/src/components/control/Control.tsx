import React, { useContext } from 'react';
import OpenColor from 'open-color';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Spacer from '../spacer/index.js';

const useStyles = createUseStyles({
  Inner: {
    border: 'none',
    outline: 'none',
    padding: '0 12px',
    minHeight: 32,
    flexDirection: 'row',
    boxShadow: `inset 0 0 0 1px ${OpenColor.gray[4]}`,
    borderRadius: 2.5,
    '&:focus-within': {
      boxShadow: `inset 0 0 0 2px ${OpenColor.blue[5]}`,
    }
  },
});

type ControlProps<T extends React.ElementType> = {
  as?: T,
  className?: string,
} & Omit<ViewProps, 'children'>;

const Control = <T extends React.ElementType>({
  as,
  className,
  ...props
}: ControlProps<T>) => {
  const styles = useStyles();

  const controlClassName = clsx(
    styles.Inner,
    className
  );

  return null;

  // return (
  //   <View as={'select'} className={controlClassName} {...props} />
  // );
};

type BarProps<T extends React.ElementType> = {
  as?: T,
  className?: string,
} & Omit<ViewProps, 'children'>;

const Bar = <T extends React.ElementType>({ as, ...props }: BarProps<'select'>) => {
  return (
    <View as={as} {...props} />
  );
};


export default Control;

export {
  useStyles,
};
