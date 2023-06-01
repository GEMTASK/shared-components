import React, { useContext } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import useFillColorStyles from '../../styles/fillColor.js';
import useAlignVerticalStyles from '../../styles/alignVertical.js';
import Color from '../../types/Color';
import ViewContext from './ViewContext.js';

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
  horizontal?: boolean,
  flex?: boolean,
  alignVertical?: 'top' | 'middle' | 'bottom',
  fillColor?: Color,
  className?: string,
  children?: React.ReactElement | React.ReactElement[],
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = 'div'>({
  as,
  horizontal,
  flex,
  alignVertical,
  fillColor,
  className,
  children,
  ...props
}: ViewProps<T>) => {
  const Component = as ?? 'div';

  const styles = useStyles();
  const fillColorStyles = useFillColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();

  const viewClassName = clsx(
    styles.View,
    horizontal && styles.horizontal,
    flex && styles.flex,
    alignVertical && alignVerticalStyles[`${alignVertical}${horizontal ? 'Horizontal' : 'Vertical'}`],
    fillColor && fillColorStyles[fillColor],
    className,
  );

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component className={viewClassName} {...props}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default View;
