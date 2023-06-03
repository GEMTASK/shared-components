import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Size from '../../types/Size.js';

import View from '../view/index.js';
import Text from '../text/index.js';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    border: 'none',
    borderRadius: Size.xxsmall,
    // cursor: 'pointer',
    '&:hover': { filter: 'brightness(1.1)' },
    '&:active': { filter: 'brightness(0.9)' },
  },
});

type ButtonProps = {
  title?: string,
  className?: string,
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Button = ({
  title,
  className,
  ...props
}: ButtonProps) => {
  const styles = useStyles();

  const buttonClassName = clsx(
    styles.Button,
    className,
  );

  return (
    <View as="button" fillColor="blue-5" paddingVertical="medium" paddingHorizontal="large" className={buttonClassName} {...props}>
      <Text fontWeight="semibold" textColor="white" style={{ pointerEvents: 'none', cursor: 'pointer' }}>
        {title}
      </Text>
    </View>
  );
};

export default Button;
