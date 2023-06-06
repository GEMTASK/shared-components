import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import Size from '../../types/Size.js';

import View from '../view/index.js';
import Text from '../text/index.js';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    border: 'none',
    borderRadius: Size.xxsmall,
    '&:hover': { filter: 'brightness(1.04)' },
    '&:active': { filter: 'brightness(0.94)' },
  },
  default: {
    '&:hover': { background: OpenColor.gray[3], filter: 'brightness(1.04)' },
    '&:active': { background: OpenColor.gray[3], filter: 'brightness(0.94)' },
  },
  hover: {
    '&:hover': { background: `${OpenColor.gray[6]}30`, filter: 'brightness(1.04)' },
    '&:active': { background: `${OpenColor.gray[6]}30`, filter: 'brightness(0.0)' },
  },
  primary: {
    '&:hover': { background: OpenColor.blue[0], filter: 'brightness(1.08)' },
    '&:active': { background: OpenColor.blue[5], filter: 'brightness(0.94)' },
  },
  round: {
    borderRadius: 1000,
  }
});

const getFillColor = ({ primary, solid }: ButtonProps) => {
  switch (true) {
    case primary && solid:
      return 'blue-5';
    case solid:
      return 'gray-3';
    default:
      return 'transparent';
  }
};

function getBorderColor({ primary, solid, hover }: ButtonProps) {
  switch (true) {
    case !hover && !primary && !solid:
      return 'gray-3';
    case primary && !solid:
      return 'blue-5';
    default:
      return undefined;
  }
}

const getTextColor = ({ primary, solid }: ButtonProps) => {
  switch (true) {
    case primary && solid:
      return 'white';
    case primary:
      return 'blue-5';
    default:
      return undefined;
  }
};

type ButtonProps = {
  title?: string,
  hover?: boolean,
  primary?: boolean,
  solid?: boolean,
  round?: boolean,
  className?: string,
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Button = ({
  title,
  hover,
  primary,
  solid,
  round,
  className,
  ...props
}: ButtonProps) => {
  const styles = useStyles();

  const buttonClassName = clsx(
    styles.Button,
    hover && styles.hover,
    !primary && !solid && styles.default,
    primary && !solid && styles.primary,
    round && styles.round,
    className,
  );

  const fillColor = getFillColor({ primary, solid });
  const borderColor = getBorderColor({ primary, solid, hover });
  const textColor = getTextColor({ primary, solid });

  return (
    <View
      as="button"
      fillColor={fillColor}
      border={borderColor !== undefined}
      borderColor={borderColor}
      paddingVertical="medium"
      paddingHorizontal="large"
      className={buttonClassName}
      {...props}
    >
      <Text fontWeight="semibold" textColor={textColor} style={{ pointerEvents: 'none' }}>
        {title}
      </Text>
    </View>
  );
};

export default Button;
