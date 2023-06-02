import React, { useContext, useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import Color from '../../types/Color';
import { AlignVertical, AlignHorizontal } from '../../types/Align';

import { alignToStyle } from '../../styles/align.js';
import useAlignHorizontalStyles from '../../styles/alignHorizontal.js';
import useAlignVerticalStyles from '../../styles/alignVertical.js';
import useFillColorStyles from '../../styles/fillColor.js';

import ViewContext from './ViewContext.js';

const DEFAULT_ELEMENT = 'div';

type ShorthandAlign =
  | 'top left' | 'top center' | 'top right'
  | 'middle left' | 'middle center' | 'middle right'
  | 'bottom left' | 'bottom center' | 'bottom right'
  ;

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

const usePaddingVerticalStyles = createUseStyles({
  small: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  medium: {
    paddingTop: 16,
    paddingBottom: 16,
  },
});

type ViewProps<T extends React.ElementType> = {
  as?: T,
  horizontal?: boolean,
  flex?: boolean,
  align?: ShorthandAlign,
  alignVertical?: AlignVertical,
  alignHorizontal?: AlignHorizontal,
  paddingVertical?: 'small' | 'medium',
  fillColor?: Color,
  className?: string,
  children?: React.ReactElement | React.ReactElement[],
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  horizontal,
  flex,
  align,
  alignVertical = alignToStyle(align)[0],
  alignHorizontal = alignToStyle(align)[1],
  paddingVertical,
  fillColor,
  className,
  children,
}: ViewProps<T>) => {
  const Component = as ?? DEFAULT_ELEMENT;

  const styles = useStyles();
  const fillColorStyles = useFillColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();

  const viewClassName = clsx(
    styles.View,
    horizontal && styles.horizontal,
    flex && styles.flex,
    alignVertical && alignVerticalStyles[`${alignVertical}${horizontal ? 'Horizontal' : 'Vertical'}`],
    alignHorizontal && alignHorizontalStyles[`${alignHorizontal}${horizontal ? 'Horizontal' : 'Vertical'}`],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    fillColor && fillColorStyles[fillColor],
    className,
  );

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component className={viewClassName}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default View;
