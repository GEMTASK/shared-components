import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import Size from '../../types/Size.js';

import View from '../view/index.js';
import Text from '../text/index.js';
import Icon from '../icon/index.js';
import Spacer from '../spacer/Spacer.js';

const useStyles = createUseStyles({
  Button: {
    appearance: 'none',
    border: 'none',
    borderRadius: Size.xxsmall,
    '&:hover': { filter: 'brightness(1.08)' },
    '&:active': { filter: 'brightness(0.90)' },
  },
  default: {
    '&:hover': { background: OpenColor.gray[3], filter: 'brightness(1.08)' },
    '&:active': { background: OpenColor.gray[3], filter: 'brightness(0.94)' },
  },
  hover: {
    '&:hover': { background: `${OpenColor.gray[5]}30`, filter: 'brightness(1.08)' },
    '&:active': { background: `${OpenColor.gray[5]}30`, filter: 'brightness(0.0)' },
  },
  primary: {
    '&:hover': { background: OpenColor.blue[0], filter: 'brightness(1.08)' },
    '&:active': { background: OpenColor.blue[5], filter: 'brightness(0.94)' },
  },
  round: {
    borderRadius: 1000,
  },
  selected: {
    filter: 'brightness(0.90)',
  },
  xsmall: {
    minHeight: 24,
  },
  small: {
    minHeight: 32,
  }
});

const getFillColor = ({ primary, solid, selected }: ButtonProps) => {
  switch (true) {
    case primary && (solid || selected):
      return 'blue-5';
    case solid || selected:
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

const getTextColor = ({ primary, solid, selected }: ButtonProps) => {
  switch (true) {
    case primary && (solid || selected):
      return 'white';
    case primary:
      return 'blue-5';
    default:
      return undefined;
  }
};

type ButtonProps = {
  size?: 'xsmall' | 'small',
  icon?: React.ComponentProps<typeof Icon>['icon'],
  title?: string,
  hover?: boolean,
  primary?: boolean,
  solid?: boolean,
  round?: boolean,
  selected?: boolean,
  className?: string,
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Button = ({
  size = 'small',
  icon,
  title,
  hover,
  primary,
  solid,
  round,
  selected,
  className,
  ...props
}: ButtonProps) => {
  const styles = useStyles();

  const buttonClassName = clsx(
    styles.Button,
    size && styles[size],
    hover && styles.hover,
    !primary && !solid && styles.default,
    primary && !solid && styles.primary,
    selected && styles.selected,
    round && styles.round,
    className,
  );

  const fillColor = getFillColor({ primary, solid, selected });
  const borderColor = getBorderColor({ primary, solid, hover });
  const textColor = getTextColor({ primary, solid, selected });

  const [color, level] = (textColor ?? '')?.split('-') as [keyof OpenColor, number | undefined];
  const iconColor = level ? OpenColor[color][level] : OpenColor[color] as string;

  const paddingVertical = size === 'xsmall' ? 'xsmall' : 'small';
  const paddingHorizontal = size === 'xsmall' ? 'medium' : 'large';

  return (
    <View
      horizontal
      as="button"
      fillColor={fillColor}
      border={borderColor !== undefined}
      borderColor={borderColor}
      paddingVertical={paddingVertical}
      paddingHorizontal={paddingHorizontal}
      align="middle center"
      className={buttonClassName}
      {...props}
    >
      {!!icon && (
        <Icon icon={icon} color={iconColor} />
      )}
      {!!icon && !!title && (
        <Spacer size="small" />
      )}
      <Text fontWeight="semibold" textColor={textColor} style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
        {title}
      </Text>
    </View>
  );
};

export default Button;
