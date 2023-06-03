import React, { CSSProperties, useContext } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import Color from '../../types/Color';

import useTextAlignStyles from '../../styles/textAlign.js';
import useTextColorStyles from '../../styles/textColor.js';

import View from '../view/index.js';

import TextContext from './TextContext.js';

const useStyles = createUseStyles({
  Text: {
    fontSize: 14,
    lineHeight: '22px',
    cursor: 'default',
    '&[contenteditable], &:active': {
      cursor: 'text'
    },
  },
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
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  textColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: Child<TextProps> | Child<TextProps>[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = ({
  fontWeight,
  textAlign,
  textColor,
  className,
  style,
  children,
  ...props
}: TextProps) => {
  const isTextParent = useContext(TextContext);

  const styles = useStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textAlignStyles = useTextAlignStyles();
  const textColorStyles = useTextColorStyles();

  const textClassName = clsx(
    styles.Text,
    fontWeight && fontWeightStyles[fontWeight],
    textAlign && textAlignStyles[textAlign],
    textColor && textColorStyles[textColor],
    className,
  );

  const textStyle = {
    display: 'inline-block',
    margin: '-3px 0 -3px 0',
    ...style,
  };

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
        <span className={textClassName} style={textStyle}>
          {childrenElement}
        </span>
      </View>
    </TextContext.Provider>
  );
};

export default Text;
