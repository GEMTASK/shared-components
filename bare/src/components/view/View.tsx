import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import useFillColorStyles from '../../styles/fillColor.js';
import useAlignVerticalStyles from '../../styles/alignVertical.js';
import useAlignHorizontalStyles from '../../styles/alignHorizontal.js';
import Color from '../../types/Color';
import Align from '../../types/Align';
import ViewContext from './ViewContext.js';

const DEFAULT_ELEMENT = 'div';

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
  alignHorizontal?: 'left' | 'center' | 'right',
  fillColor?: Color,
  className?: string,
  children?: React.ReactElement | React.ReactElement[],
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  horizontal,
  flex,
  alignVertical,
  alignHorizontal,
  fillColor,
  className,
  children,
}: ViewProps<T>) => {
  const Component = as ?? DEFAULT_ELEMENT;

  const styles = useStyles();
  const fillColorStyles = useFillColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();

  const viewClassName = clsx(
    styles.View,
    horizontal && styles.horizontal,
    flex && styles.flex,
    alignVertical && alignVerticalStyles[`${alignVertical}${horizontal ? 'Horizontal' : 'Vertical'}`],
    alignHorizontal && alignHorizontalStyles[`${alignHorizontal}${horizontal ? 'Horizontal' : 'Vertical'}`],
    fillColor && fillColorStyles[fillColor],
    className,
  );

  // const contextValue = useMemo(() => ({ isHorizontal: horizontal ?? false }), [horizontal]);

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component className={viewClassName}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default View;
