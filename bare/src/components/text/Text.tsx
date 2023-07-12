import React, { useContext } from 'react';
import clsx from 'clsx';

import Color from '../../types/Color';
import Size from '../../types/Size';

import { useInnerStyles, useFontSizeStyles, useFontWeightStyles } from './TextStyles.js';
import useTextAlignStyles from '../../styles/textAlign.js';
import useTextColorStyles from '../../styles/textColor.js';

import View from '../view/index.js';

import TextContext from './TextContext.js';

type Children<T> = string | number | React.ReactElement<T | HTMLBRElement> | Children<T>[];

type TextProps<T extends React.ElementType = 'span'> = {
  inner?: T,
  innerProps?: any,
  caps?: boolean,
  fontSize?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
  fontWeight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  textColor?: Color,
  lineClamp?: number,
  className?: string,
  style?: React.CSSProperties,
  children?: Children<TextProps>,
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = <T extends React.ElementType = 'span'>({
  inner,
  innerProps,
  caps,
  fontSize,
  fontWeight,
  textAlign,
  textColor,
  lineClamp,
  children,
  ...props
}: TextProps<T>) => {
  const isTextParent = useContext(TextContext);

  const innerStyles = useInnerStyles();
  const fontSizeStyles = useFontSizeStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textAlignStyles = useTextAlignStyles();
  const textColorStyles = useTextColorStyles();

  const innerClassName = clsx(
    innerStyles.Inner,
    caps && innerStyles.caps,
    fontSize && fontSizeStyles[fontSize],
    fontWeight && fontWeightStyles[fontWeight],
    textAlign && textAlignStyles[textAlign],
    textColor && textColorStyles[textColor],
  );

  const innerStyle = {
    outline: 'none',
    ...(lineClamp && {
      display: '-webkit-box',
      overflow: 'hidden',
      WebkitLineClamp: lineClamp,
      WebkitBoxOrient: 'vertical',
    })
  };

  const childrenElement = typeof children === 'string'
    ? children.split(/\n|\\n/).reduce<Children<TextProps>[]>((string, word, index) => (
      index > 0 ? [...string, <br key={index} />, word] : [...string, word]
    ), [])
    : children;

  const Component = inner ?? 'span';

  if (isTextParent) {
    return (
      <Component {...innerProps} className={innerClassName}>
        {childrenElement}
      </Component>
    );
  };

  return (
    <TextContext.Provider value={true}>
      <View {...props}>
        <Component {...innerProps} className={clsx(innerStyles.Text, innerClassName)} style={innerStyle}>
          {childrenElement}
        </Component>
      </View>
    </TextContext.Provider>
  );
};

export default Text;

export type {
  TextProps,
};
