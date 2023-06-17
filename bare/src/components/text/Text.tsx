import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Color from '../../types/Color';

import { useInnerStyles, useFontSizeStyles, useFontWeightStyles } from './TextStyles.js';
import useTextAlignStyles from '../../styles/textAlign.js';
import useTextColorStyles from '../../styles/textColor.js';

import View from '../view/index.js';

import TextContext from './TextContext.js';

type Child<T> = string | number | React.ReactElement<T | HTMLBRElement>;

type TextProps = {
  caps?: boolean,
  fontSize?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
  fontWeight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  textColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: Child<TextProps> | Child<TextProps>[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = ({
  caps,
  fontSize,
  fontWeight,
  textAlign,
  textColor,
  children,
  ...props
}: TextProps) => {
  const isTextParent = useContext(TextContext);

  const innerStyles = useInnerStyles();
  const fontSizeStyles = useFontSizeStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textAlignStyles = useTextAlignStyles();
  const textColorStyles = useTextColorStyles();

  const textClassName = clsx(
    innerStyles.Text,
    caps && innerStyles.caps,
    fontSize && fontSizeStyles[fontSize],
    fontWeight && fontWeightStyles[fontWeight],
    textAlign && textAlignStyles[textAlign],
    textColor && textColorStyles[textColor],
  );

  const childrenElement = typeof children === 'string'
    ? children.split(/\n|\\n/).reduce<Child<TextProps>[]>((string, word, index) => (
      index > 0 ? [...string, <br key={index} />, word] : [...string, word]
    ), [])
    : children;

  if (isTextParent) {
    return (
      <span className={textClassName}>{childrenElement}</span>
    );
  };

  return (
    <TextContext.Provider value={true}>
      <View {...props}>
        <span className={textClassName}>
          {childrenElement}
        </span>
      </View>
    </TextContext.Provider>
  );
};

export default Text;
