import React from 'react';
import { createUseStyles } from 'react-jss';
import OpenColor from 'open-color';
import clsx from 'clsx';

import useFillColorStyles from '../../styles/fillColor.js';

import Color from '../../types/Color';

const useStyles = createUseStyles({
  View: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  horizontal: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
});

type ViewProps<T extends React.ElementType> = {
  as?: T,
  flex?: boolean,
  horizontal?: boolean,
  fillColor?: Color,
  className?: string,
  children?: React.ReactElement | React.ReactElement[],
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = 'div'>({
  as,
  horizontal,
  flex,
  fillColor,
  className,
  children,
  ...props
}: ViewProps<T>) => {
  const Component = as ?? 'div';

  const styles = useStyles();
  const fillColorStyles = useFillColorStyles();

  const viewClassName = clsx(
    styles.View,
    horizontal && styles.horizontal,
    flex && styles.flex,
    fillColor && fillColorStyles[fillColor],
    className,
  );

  return (
    <Component className={viewClassName} {...props}>
      {children}
    </Component>
  );
};

export default View;
