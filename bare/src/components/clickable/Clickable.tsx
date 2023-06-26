import React from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Icon from '../icon/index.js';
import Spacer from '../spacer/index.js';

import useStyles from './ClickableStyles.js';
import Color from '../../types/Color.js';

type ButtonProps = {
  hover?: boolean,
  selected?: boolean,
  className?: string,
} & ViewProps<'a'>;

const Button = ({
  hover,
  selected,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = useStyles();

  const buttonClassName = clsx(
    styles.Button,
    hover && styles.hover,
    selected && styles.selected,
    className,
  );

  return (
    <View
      as="button"
      type="button"
      horizontal
      className={buttonClassName}
      {...props}
    >
      {children}
    </View>
  );
};

export default Button;
