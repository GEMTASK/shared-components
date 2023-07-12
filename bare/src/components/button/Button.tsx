import React from 'react';
import OpenColor from 'open-color';
import clsx from 'clsx';
import { useMediaQuery } from 'react-responsive';

import View, { ViewProps } from '../view/index.js';
import Text from '../text/index.js';
import Icon from '../icon/index.js';
import Spacer from '../spacer/index.js';

import useStyles from './ButtonStyles.js';
import Color from '../../types/Color.js';

const getFillColor = ({ primary, solid, selected }: ButtonProps) => {
  switch (true) {
    case primary && solid:
      return 'blue-5';
    case primary && selected:
      return 'blue-1';
    case solid || selected:
      return 'gray-3';
    default:
      return 'transparent';
  }
};

function getBorderColor({ primary, solid, hover, text }: ButtonProps) {
  switch (true) {
    case !text && !hover && !primary && !solid:
      return 'gray-3';
    case primary && !solid:
      return 'blue-5';
    default:
      return undefined;
  }
}

const getTextColor = ({ primary, solid, selected }: ButtonProps) => {
  switch (true) {
    case primary && solid:
      return 'white';
    case primary:
      return 'blue-5';
    default:
      return undefined;
  }
};

const getPaddingHorizontal = ({ size, title, text }: ButtonProps) => {
  switch (true) {
    case text:
      return undefined;
    case !title && size === 'xsmall':
      return 'xsmall';
    case !title && size === 'small':
      return 'small';
    case size === 'xsmall':
      return 'medium';
    case size === 'small':
      return 'large';
    case size === 'medium':
      return 'xlarge';
  }
};

const getPaddingVertical = ({ size, title, text }: ButtonProps) => {
  switch (true) {
    case text:
      return undefined;
    // case !title && size === 'xsmall':
    //   return 'xsmall';
    // case !title && size === 'small':
    //   return 'small';
    case size === 'xsmall':
      return 'xsmall';
    case size === 'small':
      return 'small';
    // case size === 'medium':
    //   return 'xlarge';
  }
};

type ButtonProps = {
  size?: 'xsmall' | 'small' | 'medium',
  icon?: React.ComponentProps<typeof Icon>['icon'],
  iconSize?: React.ComponentProps<typeof Icon>['size'],
  rightIcon?: React.ComponentProps<typeof Icon>['icon'],
  title?: string,
  titleFontWeight?: React.ComponentProps<typeof Text>['fontWeight'];
  titleTextColor?: Color,
  hover?: boolean,
  primary?: boolean,
  solid?: boolean,
  text?: boolean,
  round?: boolean,
  selected?: boolean,
  disabled?: boolean,
  tabletTitleHidden?: boolean,
  className?: string,
} & Omit<ViewProps<'button'>, 'children'>;

const Button = ({
  size = 'small',
  icon,
  iconSize,
  rightIcon,
  title,
  titleFontWeight = 'semibold',
  titleTextColor,
  hover,
  primary,
  solid,
  text,
  round,
  selected,
  disabled,
  tabletTitleHidden,
  className,
  ...props
}: ButtonProps) => {
  const isTablet = useMediaQuery({ query: '(max-width: 1279px)' });
  const styles = useStyles();

  const buttonClassName = clsx(
    styles.Button,
    size && styles[size],
    hover && styles.hover,
    !primary && !solid && styles.default,
    primary && !solid && styles.primary,
    primary && solid && styles.primarySolid,
    text && styles.text,
    // selected && styles.selected,
    disabled && styles.disabled,
    round && styles.round,
    className,
  );

  const fillColor = getFillColor({ primary, solid, selected });
  const borderColor = getBorderColor({ primary, solid, text, hover });
  const textColor = titleTextColor ?? getTextColor({ primary, solid, selected });

  const [color, level] = (textColor ?? '')?.split('-') as [keyof OpenColor, number | undefined];
  const iconColor = level ? OpenColor[color][level] : OpenColor[color] as string;

  const paddingVertical = getPaddingVertical({ size, title, text });
  const paddingHorizontal = getPaddingHorizontal({ size, title, text });

  return (
    <View
      as="button"
      type="button"
      horizontal
      disabled={disabled}
      fillColor={fillColor}
      border={borderColor !== undefined}
      borderColor={borderColor}
      paddingVertical={paddingVertical}
      paddingHorizontal={paddingHorizontal}
      align="middle center"
      minWidth={title && !isTablet ? size === 'xsmall' ? 60 : 80 : undefined}
      className={buttonClassName}
      {...props}
    >
      {!!icon && (
        <Icon icon={icon} color={iconColor} size={iconSize ?? (size === 'xsmall' ? 'sm' : undefined)} />
      )}
      {!!icon && !!title && !(tabletTitleHidden && isTablet) && (
        <Spacer size="small" minWidth={size === 'xsmall' ? 6 : undefined} />
      )}
      {!(tabletTitleHidden && isTablet) && (
        <Text
          fontSize={size === 'xsmall' ? 'xsmall' : undefined}
          fontWeight={titleFontWeight}
          textColor={textColor}
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          {title}
        </Text>
      )}
      {!!title && !!rightIcon && (
        <Spacer size="small" />
      )}
      {!!rightIcon && (
        <Icon icon={rightIcon} color={iconColor} />
      )}
    </View>
  );
};

export default Button;
