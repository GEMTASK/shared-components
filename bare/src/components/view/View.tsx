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
  children?: React.ReactNode,
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = 'div'>({
  as,
  flex,
  horizontal,
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
    flex && styles.flex,
    horizontal && styles.horizontal,
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
