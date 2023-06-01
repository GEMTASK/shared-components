import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import useTextAlignStyles from '../../styles/textAlign.js';
import Color from '../../types/Color';
import View from '../view/index.js';
import TextContext from './TextContext.js';

const useStyles = createUseStyles({
  Text: {
    fontSize: 14,
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
  bold: {
    fontWeight: 700,
  }
});

type Child<T> = string | number | React.ReactElement<T | HTMLBRElement>;

type TextProps = {
  className?: string,
  fontWeight?: 'normal' | 'bold',
  textAlign?: 'left' | 'center' | 'right',
  children?: Child<TextProps> | Child<TextProps>[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = ({
  className,
  fontWeight,
  textAlign,
  children,
  ...props
}: TextProps) => {
  const isTextParent = useContext(TextContext);

  const styles = useStyles();
  const fontWeightStyles = useFontWeightStyles();
  const textAlignStyles = useTextAlignStyles();

  const textClassName = clsx(
    styles.Text,
    fontWeight && fontWeightStyles[fontWeight],
    textAlign && textAlignStyles[textAlign],
    className,
  );

  const childrenElement = typeof children === 'string'
    ? children.split(/\n|\\n/).reduce<Child<TextProps>[]>((string, word, index) => (
      index > 0 ? [...string, <br />, word] : [...string, word]
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
        <span className={textClassName} style={{ display: 'inline-block', margin: '-3px 0 -2px 0' }}>
          {childrenElement}
        </span>
      </View>
    </TextContext.Provider>
  );
};

export default Text;
