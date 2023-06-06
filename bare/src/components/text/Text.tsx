import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Color from '../../types/Color';

import useTextAlignStyles from '../../styles/textAlign.js';
import useTextColorStyles from '../../styles/textColor.js';

import View from '../view/index.js';

import TextContext from './TextContext.js';

const useInnerStyles = createUseStyles({
  Text: {
    fontSize: 14,
    display: 'inline-block',
    cursor: 'default',
    '&[contenteditable], &:active': {
      cursor: 'text'
    },
  },
});

const useFontSizeStyles = createUseStyles({
  xxsmall: {
    fontSize: 11,
    lineHeight: '18px',
    margin: '-6px 0 -5px 0'
  },
  xsmall: {
    fontSize: 12,
    lineHeight: '18px',
    margin: '-3px 0 -4px 0'
  },
  small: {
    fontSize: 14,
    lineHeight: '20px',
    margin: '-4px 0 -4px 0'
  },
  medium: {
    fontSize: 18,
    lineHeight: '25px',
    margin: '-5px 0 -5px 0'
  },
  large: {
    fontSize: 24,
    lineHeight: '30px',
    margin: '-6px 0 -5px 0'
  },
  xlarge: {
    fontSize: 32,
    lineHeight: '35px',
    margin: '-6px 0 -5px 0'
  },
  xxlarge: {
    fontSize: 40,
    lineHeight: '40px',
    margin: '-6px 0 -4px 0'
  }
});

const useFontWeightStyles = createUseStyles({
  normal: {
    fontWeight: 400,
  },
  medium: {
    fontWeight: 500,
  },
  semibold: {
    fontWeight: 600,
  },
  bold: {
    fontWeight: 700,
  }
});

type Child<T> = string | number | React.ReactElement<T | HTMLBRElement>;

type TextProps = {
  fontSize?: 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge',
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  textColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: Child<TextProps> | Child<TextProps>[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = ({
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
    fontSizeStyles[fontSize || 'small'],
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
