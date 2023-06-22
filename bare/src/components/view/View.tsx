import React, { useContext, useMemo } from 'react';
import clsx from 'clsx';

import Color from '../../types/Color';
import Size from '../../types/Size';
import { ShorthandAlign, AlignVertical, AlignHorizontal } from '../../types/Align';
import { ShorthandPadding } from '../../types/Padding';

import useStyles from './ViewStyles.js';
import { shorthandAlignToStyle } from '../../styles/align.js';
import useAlignHorizontalStyles from '../../styles/alignHorizontal.js';
import useAlignVerticalStyles from '../../styles/alignVertical.js';
import { shorthandPaddingToStyle } from '../../styles/padding.js';
import usePaddingVerticalStyles from '../../styles/paddingVertical.js';
import usePaddingHorizontalStyles from '../../styles/paddingHorizontal.js';
import useFillColorStyles, { hues } from '../../styles/fillColor.js';
import useBorderColorStyles from '../../styles/borderColor.js';

import ViewContext from './ViewContext.js';

declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

const DEFAULT_ELEMENT = 'div';

type Children = false | null | undefined | React.ReactElement | Children[];

type ViewProps<T extends React.ElementType = 'div'> = {
  as?: T,
  horizontal?: boolean,
  flex?: boolean,
  minWidth?: number | string,
  minHeight?: number | string,
  maxWidth?: number | string,
  maxHeight?: number | string,
  align?: ShorthandAlign,
  alignVertical?: AlignVertical,
  alignHorizontal?: AlignHorizontal,
  padding?: ShorthandPadding,
  paddingVertical?: keyof typeof Size,
  paddingHorizontal?: keyof typeof Size,
  fillColor?: Color,
  border?: boolean,
  borderColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: Children,
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  horizontal,
  flex,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  align,
  alignVertical = align && shorthandAlignToStyle(align)[0],
  alignHorizontal = align && shorthandAlignToStyle(align)[1],
  padding,
  paddingVertical = padding && shorthandPaddingToStyle(padding)[0],
  paddingHorizontal = padding && shorthandPaddingToStyle(padding)[1],
  fillColor,
  border,
  borderColor,
  className,
  style,
  children,
  ...props
}: ViewProps<T>, ref: React.ForwardedRef<HTMLElement>) => {
  const Component: React.ElementType = as ?? DEFAULT_ELEMENT;

  const styles = useStyles();
  const fillColorStyles = useFillColorStyles();
  const borderColorStyles = useBorderColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();
  const paddingHorizontalStyles = usePaddingHorizontalStyles();

  const viewClassName = clsx(
    styles.View,
    horizontal && styles.horizontal,
    flex && styles.flex,
    alignVertical && alignVerticalStyles[`${alignVertical}${horizontal ? 'Horizontal' : 'Vertical'}`],
    alignHorizontal && alignHorizontalStyles[`${alignHorizontal}${horizontal ? 'Horizontal' : 'Vertical'}`],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    paddingHorizontal && paddingHorizontalStyles[paddingHorizontal],
    fillColor && fillColorStyles[fillColor],
    border && styles.border,
    // border && borderColorStyles[borderColor ?? 'gray-4'],
    className,
  );

  const viewStyle = {
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    ...style,
  };

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component ref={ref} className={viewClassName} style={viewStyle} {...props}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default React.forwardRef(View);

export {
  type ViewProps,
};
