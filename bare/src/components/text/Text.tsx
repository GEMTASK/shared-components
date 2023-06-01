import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import useFillColorStyles from '../../styles/fillColor.js';
import Color from '../../types/Color';
import View from '../view/index.js';
import TextContext from './TextContext.js';

const useStyles = createUseStyles({
  Text: {
    fontSize: 14,
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
  children?: Child<TextProps> | Child<TextProps>[],
} & Omit<React.ComponentProps<typeof View>, 'children'>;

const Text = ({
  className,
  fontWeight,
  children,
  ...props
}: TextProps) => {
  const isTextParent = useContext(TextContext);

  const styles = useStyles();
  const fontWeightStyles = useFontWeightStyles();

  const textClassName = clsx(
    styles.Text,
    fontWeight && fontWeightStyles[fontWeight],
    className,
  );

  if (isTextParent) {
    return (
      <span className={textClassName}>{children}</span>
    );
  };

  return (
    <TextContext.Provider value={true}>
      <View {...props}>
        <span className={textClassName} style={{ display: 'inline-block', margin: '-3px 0 -2px 0' }}>
          {children}
        </span>
      </View>
    </TextContext.Provider>
  );
};

export default Text;
