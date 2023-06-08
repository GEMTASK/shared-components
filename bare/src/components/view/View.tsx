import React, { useContext, useMemo } from 'react';
import clsx from 'clsx';

import Color from '../../types/Color';
import { ShorthandAlign, AlignVertical, AlignHorizontal } from '../../types/Align';

import useStyles from './ViewStyles.js';
import { shorthandAlignToStyle } from '../../styles/align.js';
import useAlignHorizontalStyles from '../../styles/alignHorizontal.js';
import useAlignVerticalStyles from '../../styles/alignVertical.js';
import usePaddingVerticalStyles from '../../styles/paddingVertical.js';
import usePaddingHorizontalStyles from '../../styles/paddingHorizontal.js';
import useFillColorStyles from '../../styles/fillColor.js';
import useBorderColorStyles from '../../styles/borderColor.js';

import ViewContext from './ViewContext.js';

const DEFAULT_ELEMENT = 'div';

// declare module "react" {
//   function forwardRef<T, P = {}>(
//     render: (props: P, ref: React.ForwardedRef<T>) => React.ReactElement | null
//   ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
// }

type ViewComponent = <T extends React.ElementType = 'div'>(
  props: ViewProps<T>,
  ref?: React.Ref<T>,
) => React.ReactElement | null;

type ViewProps<T extends React.ElementType> = {
  as?: T,
  horizontal?: boolean,
  flex?: boolean,
  align?: ShorthandAlign,
  alignVertical?: AlignVertical,
  alignHorizontal?: AlignHorizontal,
  paddingVertical?: 'xsmall' | 'small' | 'medium' | 'large',
  paddingHorizontal?: 'xsmall' | 'small' | 'medium' | 'large',
  fillColor?: Color,
  border?: boolean,
  borderColor?: Color,
  className?: string,
  style?: React.CSSProperties,
  children?: React.ReactElement | (React.ReactElement | false)[],
} & React.ComponentPropsWithoutRef<T>;

const View = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  horizontal,
  flex,
  align,
  alignVertical = align && shorthandAlignToStyle(align)[0],
  alignHorizontal = align && shorthandAlignToStyle(align)[1],
  paddingVertical,
  paddingHorizontal,
  fillColor,
  border,
  borderColor,
  className,
  style,
  children,
  ...props
}: ViewProps<T>) => {
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
    border && borderColorStyles[borderColor ?? 'gray-3'],
    className,
  );

  const viewStyle = {
    ...style,
  };

  return (
    <ViewContext.Provider value={{ isHorizontal: horizontal ?? false }}>
      <Component className={viewClassName} style={viewStyle} {...props}>
        {children}
      </Component>
    </ViewContext.Provider>
  );
};

export default View;
