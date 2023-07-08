import React from 'react';
import { createUseStyles } from 'react-jss';
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

const useHoverStyles = createUseStyles({
  [`${'a'}-parent`]: {},
  [`${'a'}-child`]: {
    opacity: 0.0,
    transition: 'opacity 0.1s',
    [`\$${'a'}-parent:hover &`]: {
      opacity: 1.0,
    }
  }
});

type ViewProps<T extends React.ElementType = 'div'> = {
  as?: T,
  flex?: boolean,
  horizontal?: boolean,
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
  borderOpacity?: 1,
  shadow?: boolean,
  scrollbar?: boolean,
  hoverTarget?: string,
  hoverParent?: string,
  className?: string,
  style?: React.CSSProperties,
  children?: Children,
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  flex,
  horizontal,
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
  borderOpacity,
  shadow,
  scrollbar = true,
  hoverTarget,
  hoverParent,
  className,
  style,
  children,
  ...props
}: ViewProps<T>, ref: React.ForwardedRef<HTMLElement>) => {
  const Component: React.ElementType = as ?? DEFAULT_ELEMENT;

  const styles = useStyles();
  const hoverStyles = useHoverStyles();
  const fillColorStyles = useFillColorStyles();
  const borderColorStyles = useBorderColorStyles();
  const alignVerticalStyles = useAlignVerticalStyles();
  const alignHorizontalStyles = useAlignHorizontalStyles();
  const paddingVerticalStyles = usePaddingVerticalStyles();
  const paddingHorizontalStyles = usePaddingHorizontalStyles();

  const viewClassName = clsx(
    styles.View,
    flex && styles.flex,
    horizontal && styles.horizontal,
    alignVertical && alignVerticalStyles[`${alignVertical}${horizontal ? 'Horizontal' : 'Vertical'}`],
    alignHorizontal && alignHorizontalStyles[`${alignHorizontal}${horizontal ? 'Horizontal' : 'Vertical'}`],
    paddingVertical && paddingVerticalStyles[paddingVertical],
    paddingHorizontal && paddingHorizontalStyles[paddingHorizontal],
    fillColor && fillColorStyles[fillColor],
    border && styles.border,
    borderColorStyles[borderColor ?? 'gray-2'],
    shadow && styles.shadow,
    !scrollbar && styles.noScrollbar,
    hoverTarget && hoverStyles[`${hoverTarget}-parent`],
    hoverParent && hoverStyles[`${hoverParent}-child`],
    className,
  );

  const viewStyle = {
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    ...style,
  };

  const childCount = React.Children.count(children);

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component ref={ref} className={viewClassName} style={viewStyle} {...props}>
        {border || shadow ? (
          React.Children.map(children, (child, index) => React.isValidElement(child) && React.cloneElement(child as React.ReactElement, {
            style: {
              ...(child.props as any).style,
              borderTopLeftRadius: index === 0 ? 2.5 : undefined,
              borderTopRightRadius: !horizontal && index === 0 ? 2.5 : undefined,
              borderBottomLeftRadius: horizontal || index === childCount - 1 ? 2.5 : undefined,
              borderBottomRightRadius: index === childCount - 1 ? 2.5 : undefined,
            }
          }))
        ) : (
          children
        )}
      </Component>
    </ViewContext.Provider>
  );
};

export default React.forwardRef(View);

export {
  type ViewProps,
};
