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
  as?: T,
  caps?: boolean,
  fontSize?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
  fontWeight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  textColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: Children<TextProps>,
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = <T extends React.ElementType = 'span'>({
  as,
  caps,
  fontSize,
  fontWeight,
  textAlign,
  textColor,
  children,
  ...props
}: TextProps<T>) => {
  const isTextParent = useContext(TextContext);

  const innerStyles = useInnerStyles();
  const fontSizeStyles = useFontSizeStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textAlignStyles = useTextAlignStyles();
  const textColorStyles = useTextColorStyles();

  const textClassName = clsx(
    caps && innerStyles.caps,
    fontSize && fontSizeStyles[fontSize],
    fontWeight && fontWeightStyles[fontWeight],
    textAlign && textAlignStyles[textAlign],
    textColor && textColorStyles[textColor],
  );

  const childrenElement = typeof children === 'string'
    ? children.split(/\n|\\n/).reduce<Children<TextProps>[]>((string, word, index) => (
      index > 0 ? [...string, <br key={index} />, word] : [...string, word]
    ), [])
    : children;

  const Component = as ?? 'span';

  if (isTextParent) {
    return (
      <Component className={textClassName}>{childrenElement}</Component>
    );
  };

  return (
    <TextContext.Provider value={true}>
      <View {...props}>
        <Component className={clsx(innerStyles.Text, textClassName)}>
          {childrenElement}
        </Component>
      </View>
    </TextContext.Provider>
  );
};

export default Text;
